require('cross-fetch/polyfill');

const { default: ApolloClient, gql } = require('apollo-boost');
const bcrypt = require('bcrypt');
const prisma = require('../src/prisma');

const client = new ApolloClient({
    uri: `http://localhost:${process.env.PORT}`
});

beforeEach(async() => {
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();
    const user = await prisma.mutation.createUser({
        data: {
            name: 'Jen',
            email: 'jen@example.com',
            password: bcrypt.hashSync('P@ssword!1234', 10),
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

describe('posts', () => {
    test('should expose published posts', async() => {
        const getPosts = gql`
        query {
            posts {
                id
                title
                body
                published
             }
        }
    `;
        const response = await client.query({ query: getPosts });
        expect(response.data.posts.length).toBe(1);
        expect(response.data.posts[0].published).toBe(true);
        expect(response.data.posts[0].title).toBe('My Published Works!');
        expect(response.data.posts[0].body).toBe('Lorem ipsum.');
    });
});

describe('login', () => {

    test('should not login with bad credentials', async () => {
        const login = gql`
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
        await expect(client.mutate({ mutation: login })).rejects.toThrow();
    });

    test('should login with good credentials', async () => {
        const login = gql`
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
        const response = await client.mutate({ mutation: login });
        expect(response.data.login.user.name).toBe('Jen');
    });
});

describe('createUser', () => {
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
