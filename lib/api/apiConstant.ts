
//App URL
const GLOBAL = "/v1/";
const TEST_SUITS = "test-suites";
const TEST_CASE = "test-cases";
const TARGET_AGENTS = "target-agents";
const USER_AGENTS = "user-agents";
const TEST_HISTORY = "test-history";
const RUN_SUITE = "run-suite";
const RUN_CASE = "run-case";


//agents endpoints
export const TESTSUITS = {
    test_suit: {
        create: (user_id: string) => GLOBAL + TEST_SUITS + `?user_id=${user_id}`,
        update: (test_suit_id: string) => GLOBAL + TEST_SUITS + `/${test_suit_id}`,
        getAll: (user_id: string) => GLOBAL + TEST_SUITS + `?user_id=${user_id}`,
        getById: (test_suit_id: string) => GLOBAL + TEST_SUITS + `/${test_suit_id}` + "/details",
        delete: (test_suit_id: string) => GLOBAL + TEST_SUITS + `/${test_suit_id}`,
    },
    test_case: {
        create: GLOBAL + TEST_CASE,
        update: (test_case_id: string) => GLOBAL + TEST_CASE + `/${test_case_id}`,
        delete: (test_case_id: string) => GLOBAL + TEST_CASE + `/${test_case_id}`,
        getAll: (test_suit_id: string) => GLOBAL + TEST_CASE + `?test_suit_id=${test_suit_id}`,
    },
    target_agents: {
        create: GLOBAL + TARGET_AGENTS,
        update: (target_agent_id: string) => GLOBAL + TARGET_AGENTS + `/${target_agent_id}`,
        delete: (target_agent_id: string) => GLOBAL + TARGET_AGENTS + `/${target_agent_id}`,
        getAll: (user_id: string) => GLOBAL + TARGET_AGENTS + `?user_id=${user_id}`,
    },
    user_agents: {
        create: GLOBAL + USER_AGENTS,
        update: (user_agent_id: string) => GLOBAL + USER_AGENTS + `/${user_agent_id}`,
        getAll: (user_id: string) => GLOBAL + USER_AGENTS + `?user_id=${user_id}`,
        delete: (user_agent_id: string) => GLOBAL + USER_AGENTS + `/${user_agent_id}`,
    },
    test_history: {
        getAllRuns: (user_id: string) => GLOBAL + TEST_HISTORY + `?user_id=${user_id}`,
        getById: (test_history_id: string) => GLOBAL + TEST_HISTORY + `/${test_history_id}`,
    },
    run_test: {
        runAll: (test_suit_id: string, user_id: string) => GLOBAL + "test-execution/" + RUN_SUITE + `/${test_suit_id}?user_id=${user_id}`,
        runSingleTest: (test_case_id: string, user_id: string) => GLOBAL + "test-execution/" + RUN_CASE + `/${test_case_id}?user_id=${user_id}`,
        getAllRuns: (user_id: string) => GLOBAL + "test-execution/" + "runs" + `?user_id=${user_id}`,
        getCallLogsByRequestId: (request_id: string, user_id: string) => GLOBAL + "test-execution/" + "call-logs" + `/${request_id}?user_id=${user_id}`,
    },
};