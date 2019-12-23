const getClient = require('./utils/getClient');
const ops = require('./utils/operations');
const prisma = require('../src/prisma');
const { seedDatabase, users } = require('./utils/seedDatabase');

const client = getClient();

beforeEach(seedDatabase);

describe('getUsers', () => {

    test('should expose public author profiles', async() => {
        const response = await client.query({ query: ops.getUsers });
        expect(response.data.users.length).toBe(2);
        expect(response.data.users[0].email).toBe(null);
        expect(response.data.users[0].name).toBe('Jen');
    });
});

describe('createUser', () => {

    test('should create a new user', async(done) => {
        const variables = {
            data: {
                name: 'Andrew',
                email: 'andrew@example.com',
                password: 'MyPass123'
            }
        };
        const response = await client.mutate({ mutation: ops.createUser, variables });
        const exists = await prisma.exists.User({ id: response.data.createUser.user.id });
        expect(exists).toBe(true);
        done();
    });

    test('should fail with short password', async() => {
        const variables = {
            data: {
                name: 'Keanu',
                email: 'keanu@example.com',
                password: '1234567'
            }
        };
        await expect( client.mutate({ mutation: ops.createUser, variables })).rejects.toThrow();
    });
});

describe('getProfile', () => {
    test('should fetch user profile', async() => {
        const client = getClient(users[0].jwt);
        await client.query({ query: ops.me });
    });
});
