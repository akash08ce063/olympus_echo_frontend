import apiClient from "@/lib/api/axios";

// Example User Service
export const UserService = {
    // Get current user profile
    getProfile: () => apiClient.get("/users/me"),

    // Update user profile
    updateProfile: (data: any) => apiClient.put("/users/me", data),
};

// Example Generic API Service (can be expanded)
export const ApiService = {
    get: (url: string, config?: any) => apiClient.get(url, config),
    post: (url: string, data: any, config?: any) => apiClient.post(url, data, config),
    put: (url: string, data: any, config?: any) => apiClient.put(url, data, config),
    delete: (url: string, config?: any) => apiClient.delete(url, config),
};
