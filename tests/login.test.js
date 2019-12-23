const getClient = require('./utils/getClient');
const ops = require('./utils/operations');
const { seedDatabase } = require('./utils/seedDatabase');

const client = getClient();

beforeEach(seedDatabase);

describe('login', () => {

    test('should not login with bad credentials', async () => {
        const variables = {
            data: {
                email: 'jerk@example.com',
                password: 'dudu1234',
            }
        };
        await expect(client.mutate({ mutation: ops.login, variables })).rejects.toThrow();
    });

    test('should login with good credentials', async () => {
        const variables = {
            data: {
                email: 'jen@example.com',
                password: 'P@ssword!1234',
            }
        };
        const response = await client.mutate({ mutation: ops.login, variables });
        expect(response.data.login.user.name).toBe('Jen');
    });
});
