
//App URL
const GLOBAL = "/v1/";
const TEST_SUITS = "test-suites";
const TEST_CASE = "test-cases";
const TARGET_AGENTS = "target-agents";
const USER_AGENTS = "user-agents";

//agents endpoints
export const TESTSUITS = {
    test_suit: {
        create: (user_id: string) => GLOBAL + TEST_SUITS + `?user_id=${user_id}`,
        update: (test_suit_id: string) => GLOBAL + TEST_SUITS + `/${test_suit_id}`,
        getAll: (user_id: string) => GLOBAL + TEST_SUITS + `?user_id=${user_id}`,
        getById: (test_suit_id: string) => GLOBAL + TEST_SUITS + `/${test_suit_id}` + "/details",
    },
    test_case: {
        create: GLOBAL + TEST_CASE,
        getAll: (test_suit_id: string) => GLOBAL + TEST_CASE + `?test_suit_id=${test_suit_id}`,
    },
    target_agents: {

        create: GLOBAL + TARGET_AGENTS,
        getAll: (user_id: string) => GLOBAL + TARGET_AGENTS + `?user_id=${user_id}`,
    },
    user_agents: {
        create: GLOBAL + USER_AGENTS,
        getAll: (user_id: string) => GLOBAL + USER_AGENTS + `?user_id=${user_id}`,
    }
};