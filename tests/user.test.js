require('cross-fetch/polyfill');

const { default: ApolloBoost, gql } = require('apollo-boost');
const bcrypt = require('bcrypt');
const prisma = require('../src/prisma');

const client = new ApolloBoost({
    uri: `http://localhost:${process.env.PORT}`
});

beforeEach(async() => {
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();
    const user = await prisma.mutation.createUser({
        data: {
            name: 'Jen',
            email: 'jen@example.com',
            password: bcrypt.hashSync('Blue0893!,.#', 10),
        }
    });
    await prisma.mutation.createPost({
        data: {
            author: { connect: { id: user.id } },
            title: 'My Published Works!',
            body: 'Lorem ipsum.',
            published: true,
        }
    });
    await prisma.mutation.createPost({
        data: {
            author: { connect: { id: user.id } },
            title: 'In Draft',
            body: 'TBD',
            published: false,
        }
    });
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
