import apiClient from "@/lib/api/axios";
import { TESTSUITS } from "@/lib/api/apiConstant";

export interface TestSuite {
    id: string;
    name: string;
    description?: string;
    target_agent_id?: string;
    user_agent_id?: string;
    createdAt: string;
    testCount: number;
}

export interface CreateTestSuitePayload {
    name: string;
    description: string;
}

export interface UpdateTestSuitePayload {
    name?: string;
    description?: string;
    target_agent_id?: string;
    user_agent_id?: string;
}

export const TestSuitesService = {
    // Create a new test suite
    createTestSuite: (userId: string, data: CreateTestSuitePayload) =>
        apiClient.post(TESTSUITS.test_suit.create(userId), data),

    // Update an existing test suite
    updateTestSuite: (id: string, data: UpdateTestSuitePayload) =>
        apiClient.put(`/test_suites/${id}`, data),

    // Get all test suites (optional, but likely needed later)
    getTestSuites: () =>
        apiClient.get("/test_suites"),

    // Get a specific test suite (optional)
    getTestSuite: (id: string) =>
        apiClient.get(`/test_suites/${id}`),
};
