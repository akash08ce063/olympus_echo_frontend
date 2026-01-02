
//App URL
const GLOBAL = "/v1/";
const TEST_SUITS = "test-suites";
const TARGET_AGENTS = "target-agents";
const USER_AGENTS = "user-agents";

//agents endpoints
export const TESTSUITS = {
    test_suit: {
        create: (user_id: string) => GLOBAL + TEST_SUITS + `?user_id=${user_id}`,
        getAll: (user_id: string) => GLOBAL + TEST_SUITS + `?user_id=${user_id}`,
    },
    target_agents: {
        create: (user_id: string) => GLOBAL + TARGET_AGENTS + `?user_id=${user_id}`,
        getAll: (user_id: string) => GLOBAL + TARGET_AGENTS + `?user_id=${user_id}`,
    },
    user_agents: {
        create: (user_id: string) => GLOBAL + USER_AGENTS + `?user_id=${user_id}`,
        getAll: (user_id: string) => GLOBAL + USER_AGENTS + `?user_id=${user_id}`,
    }
};