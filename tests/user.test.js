require('cross-fetch/polyfill');

const { gql } = require('apollo-boost');
const getClient = require('./utils/getClient');
const prisma = require('../src/prisma');
const { seedDatabase, userOne } = require('./utils/seedDatabase');

const client = getClient();
const createUserGQL = gql`
    mutation($data: CreateUserInput!) {
        createUser(data: $data) {
            token,
            user {
                id
                name
                email
            }
        }
    }
`;
const getUsersGQL = gql`
    query {
        users {
            id
            name
            email
        }
    }
`;
const meGQL = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;

beforeEach(seedDatabase);

describe('getUsers', () => {

    test('should expose public author profiles', async() => {
        const response = await client.query({ query: getUsersGQL });
        expect(response.data.users.length).toBe(1);
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
        const response = await client.mutate({ mutation: createUserGQL, variables });
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
        await expect( client.mutate({ mutation: createUserGQL, variables })).rejects.toThrow();
    });
});

describe('getProfile', () => {
    test('should fetch user profile', async() => {
        const client = getClient(userOne.jwt);
        await client.query({ query: meGQL });
    });
});
