require('cross-fetch/polyfill');

const { default: ApolloClient, gql } = require('apollo-boost');
const prisma = require('../src/prisma');
const seedDatabase = require('./utils/seedDatabase');

const client = new ApolloClient({ uri: `http://localhost:${process.env.PORT}` });

beforeEach(seedDatabase);

describe('getUsers', () => {

    test('should expose public author profiles', async() => {
        const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `;
        const response = await client.query({ query: getUsers });
        expect(response.data.users.length).toBe(1);
        expect(response.data.users[0].email).toBe(null);
        expect(response.data.users[0].name).toBe('Jen');
    });
});

describe('createUser', () => {

    test('should create a new user', async(done) => {
        const createUser = gql`
        mutation {
            createUser(data: {
                name: "James",
                email: "james@example.com",
                password: "pass1234"
            }) {
                token,
                user {
                    id
                }
            }
        }
    `;

        const response = await client.mutate({ mutation: createUser });
        const exists = await prisma.exists.User({ id: response.data.createUser.user.id });
        expect(exists).toBe(true);
        done();
    });

    test('should fail with short password', async() => {
        const createUser = gql`
            mutation {
                createUser(data: {
                    name: "keanu",
                    email: "keanu@example.com",
                    password: "1234567"
                }){
                    id
                }
            }
        `;
        await expect(client.mutate({ mutation: createUser })).rejects.toThrow();
    });
});
