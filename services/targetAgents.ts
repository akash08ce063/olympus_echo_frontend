import apiClient from "@/lib/api/axios";
import { TESTSUITS } from "@/lib/api/apiConstant";

/** For HTTP(S) agent URLs: how to request and parse the WebSocket URL from the response. */
export interface ConnectionMetadata {
    method?: "GET" | "POST" | "PUT" | "PATCH";
    headers?: Record<string, string>;
    payload?: Record<string, unknown>;
    response_websocket_url_path?: string;
}

export type TargetAgentType = "custom" | "vapi" | "retell";

export interface CreateTargetAgentPayload {
    name: string;
    agent_type?: TargetAgentType;
    websocket_url?: string;
    sample_rate: number;
    encoding: string;
    user_id: string;
    connection_metadata?: ConnectionMetadata | null;
    provider_config?: { assistant_id?: string; api_key?: string } | null;
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
