
//App URL
const GLOBAL = "/v1/";
const TEST_SUITS = "test-suites";
const TARGET_AGENTS = "target-agents";

//agents endpoints
export const TESTSUITS = {
    test_suit: {
        create: (user_id: string) => GLOBAL + TEST_SUITS + `?user_id=${user_id}`,
        getAll: (user_id: string) => GLOBAL + TEST_SUITS + `?user_id=${user_id}`,
        getById: (test_suit_id: string) => GLOBAL + TEST_SUITS + `/${test_suit_id}` + "/details",
    },
    target_agents: {
        create: (user_id: string) => GLOBAL + TARGET_AGENTS + `?user_id=${user_id}`,
        getAll: (user_id: string) => GLOBAL + TARGET_AGENTS + `?user_id=${user_id}`,
    }
};