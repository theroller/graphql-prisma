require('cross-fetch/polyfill');

const { gql } = require('apollo-boost');
const getClient = require('./utils/getClient');
const { seedDatabase } = require('./utils/seedDatabase');

const client = getClient();

beforeEach(seedDatabase);

describe('login', () => {

    test('should not login with bad credentials', async () => {
        const mutation = gql`
            mutation {
                login(
                    data: {
                        email: "jerk@example.com",
                        password: "dudu1234",
                    }
                ){
                    token
                }
            }
        `;
        await expect(client.mutate({ mutation })).rejects.toThrow();
    });

    test('should login with good credentials', async () => {
        const mutation = gql`
            mutation {
                login(
                    data: {
                        email: "jen@example.com",
                        password: "P@ssword!1234",
                    }
                ){
                    token
                    user {
                        name
                    }
                }
            }
        `;
        const response = await client.mutate({ mutation });
        expect(response.data.login.user.name).toBe('Jen');
    });
});
