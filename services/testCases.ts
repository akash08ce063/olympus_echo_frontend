import apiClient from "@/lib/api/axios";
import { TESTSUITS } from "@/lib/api/apiConstant";
import { TestCase } from "@/types/test-suite";

export const TestCaseService = {
    // Create a new test case
    createTestCase: (data: Partial<TestCase>) =>
        apiClient.post(TESTSUITS.test_case.create, data),

    // Get all test cases for a suite
    getTestCasesBySuite: (suiteId: string) =>
        apiClient.get(TESTSUITS.test_case.getAll(suiteId)),
};
