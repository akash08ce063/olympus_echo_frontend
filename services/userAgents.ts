import apiClient from "@/lib/api/axios";
import { TESTSUITS } from "@/lib/api/apiConstant";

export interface CreateUserAgentPayload {
    name: string;
    system_prompt: string;
    temperature: number;
    user_id: string;
}

export const UserAgentsService = {
    // Create a new user agent
    createUserAgent: (data: CreateUserAgentPayload) =>
        apiClient.post(TESTSUITS.user_agents.create, data),

    // Get all user agents for a user
    getUserAgents: (userId: string) =>
        apiClient.get(TESTSUITS.user_agents.getAll(userId)),

    // Get a specific user agent
    getUserAgent: (id: string) =>
        apiClient.get(`/v1/user-agents/${id}`),
};
