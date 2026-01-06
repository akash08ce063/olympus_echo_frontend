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

    // Get all test suites
    getTestSuites: (userId: string) =>
        apiClient.get(TESTSUITS.test_suit.getAll(userId)),

    // Get a specific test suite (optional)
    getTestSuite: (id: string) =>
        apiClient.get(`/test_suites/${id}`),

    // Get test suite details (including test cases, etc.)
    getTestSuiteDetails: (id: string) =>
        apiClient.get(TESTSUITS.test_suit.getById(id)),

    // Update test suite configuration
    updateTestSuite: (id: string, data: UpdateTestSuitePayload) =>
        apiClient.put(TESTSUITS.test_suit.update(id), data),

    // Delete a test suite
    deleteTestSuite: (id: string) =>
        apiClient.delete(TESTSUITS.test_suit.delete(id)),

    // Run a test suite
    runTestSuite: (testSuiteId: string, userId: string, concurrentCalls: number = 1) =>
        apiClient.post(TESTSUITS.run_test.runAll(testSuiteId, userId), { concurrent_calls: concurrentCalls }),

    // Run a single test case
    runSingleTest: (testCaseId: string, userId: string, concurrentCalls: number = 1) =>
        apiClient.post(TESTSUITS.run_test.runSingleTest(testCaseId, userId), { concurrent_calls: concurrentCalls }),

    // Get all test runs
    getAllRuns: (userId: string) =>
        apiClient.get(TESTSUITS.run_test.getAllRuns(userId)),

    // Get call logs for a specific request ID
    getCallLogsByRequestId: (requestId: string, userId: string) =>
        apiClient.get(TESTSUITS.run_test.getCallLogsByRequestId(requestId, userId)),
};
