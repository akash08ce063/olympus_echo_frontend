
//App URL
const GLOBAL = "/api/v1/";

//agents endpoints
export const TESTSUITS = {
    test_suit: {
        create: (user_id: string) => GLOBAL + `test-suites/${user_id}`,
    },
};