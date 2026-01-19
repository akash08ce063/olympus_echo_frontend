"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const supabase = createClient();

    useEffect(() => {
        const loadSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
            setAccessToken(data?.session?.access_token ?? null);
            setLoading(false);
        };

        loadSession();

        const { data: subscription } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user ?? null;
                const currentToken = session?.access_token ?? null;

                // Use functional updates to ensure we are working with the latest state
                setUser((prevUser) => {
                    if (prevUser?.id === currentUser?.id) return prevUser;
                    return currentUser;
                });

                setAccessToken((prevToken) => {
                    if (prevToken === currentToken) return prevToken;
                    return currentToken;
                });

                setLoading(false);
            }
        );

        return () => subscription.subscription.unsubscribe();
    }, [supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setAccessToken(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, signOut, loading, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
