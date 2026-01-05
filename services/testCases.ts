import apiClient from "@/lib/api/axios";
import { TESTSUITS } from "@/lib/api/apiConstant";
import { TestCase } from "@/types/test-suite";

export const TestCaseService = {
    // Create a new test case
    createTestCase: (data: Partial<TestCase>) =>
        apiClient.post(TESTSUITS.test_case.create, data),

    // Update a test case
    updateTestCase: (id: string, data: Partial<TestCase>) =>
        apiClient.put(TESTSUITS.test_case.update(id), data),

    // Delete a test case
    deleteTestCase: (id: string) =>
        apiClient.delete(TESTSUITS.test_case.delete(id)),

    // Get all test cases for a suite
    getTestCasesBySuite: (suiteId: string) =>
        apiClient.get(TESTSUITS.test_case.getAll(suiteId)),
};
