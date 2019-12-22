require('cross-fetch/polyfill');

const { gql } = require('apollo-boost');
const getClient = require('./utils/getClient');
const { seedDatabase } = require('./utils/seedDatabase');

const client = getClient();
const loginGQL = gql`
    mutation($data: LoginUserInput!) {
        login(data: $data){
            token
            user {
                name
            }
        }
    }
`;

beforeEach(seedDatabase);

describe('login', () => {

    test('should not login with bad credentials', async () => {
        const variables = {
            data: {
                email: 'jerk@example.com',
                password: 'dudu1234',
            }
        };
        await expect(client.mutate({ mutation: loginGQL, variables })).rejects.toThrow();
    });

    test('should login with good credentials', async () => {
        const variables = {
            data: {
                email: 'jen@example.com',
                password: 'P@ssword!1234',
            }
        };
        const response = await client.mutate({ mutation: loginGQL, variables });
        expect(response.data.login.user.name).toBe('Jen');
    });
});
