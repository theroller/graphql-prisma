require('cross-fetch/polyfill');

const { default: ApolloBoost, gql } = require('apollo-boost');
const prisma = require('../src/prisma');

const client = new ApolloBoost({
    uri: `http://localhost:${process.env.PORT}`
});

beforeEach(async() => {
    await prisma.mutation.deleteManyUsers();
});

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
