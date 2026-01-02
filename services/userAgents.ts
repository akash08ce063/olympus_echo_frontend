import apiClient from "@/lib/api/axios";
import { TESTSUITS } from "@/lib/api/apiConstant";

export const UserAgentsService = {
    // Get all user agents for a user
    getUserAgents: (userId: string) =>
        apiClient.get(TESTSUITS.user_agents.getAll(userId)),

    // Get a specific user agent
    getUserAgent: (id: string) =>
        apiClient.get(`/v1/user-agents/${id}`),
};
