import apiClient from "@/lib/api/axios";
import { TESTSUITS } from "@/lib/api/apiConstant";

export interface CreateTargetAgentPayload {
    name: string;
    agent_type: "custom" | "vapi" | "retell" | "phone";
    websocket_url?: string;
    sample_rate: number;
    encoding: string;
    user_id: string;
    connection_metadata?: Record<string, any>;
    provider_config?: Record<string, any>;
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
        apiClient.get(TESTSUITS.target_agents.update(id)), // Re-using update endpoint for GET is common

    // Update a target agent
    updateTargetAgent: (id: string, data: Partial<CreateTargetAgentPayload>) =>
        apiClient.put(TESTSUITS.target_agents.update(id), data),

    // Delete a target agent
    deleteTargetAgent: (id: string) =>
        apiClient.delete(TESTSUITS.target_agents.delete(id)),
};
