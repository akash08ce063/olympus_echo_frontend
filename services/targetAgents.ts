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
    createTargetAgent: (userId: string, data: CreateTargetAgentPayload) =>
        apiClient.post(TESTSUITS.target_agents.create(userId), data),
};
