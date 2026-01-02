import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { APP_BASE_URL } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

// Supabase client for auth operations
const supabase = createClient();

let cachedToken: string | null = null;
let lastCheck = 0;

const CHECK_INTERVAL = 1000 * 60 * 5; // Check every 5 minutes
let refreshPromise: Promise<string | null> | null = null;

/**
 * Handles laptop sleep (short/long), parallel requests, and high frequency calls.
 */
const getValidToken = async (): Promise<string | null> => {
    const now = Date.now();

    // 1. Fast Track: Use memory cache if it's fresh
    if (cachedToken && now - lastCheck < CHECK_INTERVAL) {
        return cachedToken;
    }

    // 2. Parallel Request Lock: If already checking/refreshing, wait for it
    if (refreshPromise) {
        return refreshPromise;
    }

    // 3. Health Check: Ask Supabase for current valid session (auto-refreshes if needed)
    refreshPromise = (async () => {
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) throw error;

            const token = session?.access_token || null;
            cachedToken = token;
            lastCheck = Date.now();
            return token;
        } catch (err) {
            console.warn("Session check fallback:", err);
            return cachedToken; // Fallback to whatever we have if network is flaky
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

// Keep memory cache in sync with global auth state (login/logout/background refresh)
supabase.auth.onAuthStateChange((_event, session) => {
    cachedToken = session?.access_token || null;
    lastCheck = Date.now();
});

const apiClient = axios.create({
    baseURL: APP_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true, // Enable if needed for local dev through ngrok
    },
});

// ✅ Request Interceptor: Zero latency for frequent calls, resilient for wake-ups
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // config.headers["x-pranthora-callid"] = uuidv4();

            const token = await getValidToken();
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        } catch (err) {
            console.error("Request interceptor error:", err);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global lock for session refresh to prevent multiple concurrent refreshes
let sessionRefreshPromise: Promise<string | null> | null = null;

// ✅ Response Interceptor: Final safety net for 401s
apiClient.interceptors.response.use(
    (response) => response.data, // Return only data to simplify usage
    async (error) => {
        const originalRequest = error.config;

        // If pre-emptive check failed or token was revoked mid-flight
        if (error.response?.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 1. Use global promise lock to avoid race conditions
                if (!sessionRefreshPromise) {
                    sessionRefreshPromise = (async () => {
                        try {
                            // 2. Clear known bad states immediately
                            cachedToken = null;

                            // 3. Forceful refresh with timeout
                            const refreshCall = supabase.auth.refreshSession();
                            const timeoutCall = new Promise((_, reject) =>
                                setTimeout(() => reject(new Error("Refresh timeout")), 8000)
                            );

                            const refreshResult = (await Promise.race([
                                refreshCall,
                                timeoutCall,
                            ])) as any;

                            const session = refreshResult.data?.session;
                            const error = refreshResult.error;

                            if (!error && session?.access_token) {
                                cachedToken = session.access_token;
                                lastCheck = Date.now();
                                return session.access_token;
                            }

                            if (error) {
                                console.error("❌ Refresh error:", error.message);
                            }
                            return null;
                        } catch (err) {
                            return null;
                        }
                    })();
                }

                const newToken = await sessionRefreshPromise;
                sessionRefreshPromise = null; // Clear lock after resolution

                if (newToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (err) {
                console.error("Critical interceptor failure:", err);
                sessionRefreshPromise = null;
            }

            // If we reach here, recovery failed (or timed out). Fatal logout.
            console.error(
                "⛔ Session recovery failed. Forced logout to unblock application."
            );

            try {
                // Clear local cache immediately
                cachedToken = null;
                lastCheck = 0;

                // Non-blocking sign out attempt
                supabase.auth.signOut().catch((e) => console.error("SignOut error:", e));
            } finally {
                // guaranteed redirect to unblock user
                // Using window.location instead of router to ensure full app reload/clear
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }

        // Pass through error usually, but maybe normalize it if needed
        return Promise.reject(error);
    }
);

export default apiClient;
