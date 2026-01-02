import apiClient from "@/lib/api/axios";
import { TESTSUITS } from "@/lib/api/apiConstant";

export interface CreateTargetAgentPayload {
    name: string;
    websocket_url: string;
    sample_rate: number;
    encoding: string;
}

export const TargetAgentsService = {
    // Create a new target agent
    createTargetAgent: (data: CreateTargetAgentPayload) =>
        apiClient.post(TESTSUITS.target_agents.create, data),

    // Get all target agents for a user
    getTargetAgents: (userId: string) =>
        apiClient.get(TESTSUITS.target_agents.getAll(userId)),

    // Get a specific target agent
    getTargetAgent: (id: string) =>
        apiClient.get(`/v1/target-agents/${id}`),
};
