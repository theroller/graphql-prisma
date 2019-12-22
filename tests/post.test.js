require('cross-fetch/polyfill');

const { gql } = require('apollo-boost');
const getClient = require('./utils/getClient');
const prisma = require('../src/prisma');
const { seedDatabase, posts, userOne } = require('./utils/seedDatabase');

const client = getClient();
const myPostsGQL = gql`
    query {
        myPosts {
            id
            title
            body
            published
        }
    }
`;
const postsGQL = gql`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`;

beforeEach(seedDatabase);

describe('getPosts', () => {
    test('should expose published posts', async() => {
        const { data } = await client.query({ query: postsGQL });
        expect(data.posts.length).toBe(1);
        expect(data.posts[0].published).toBe(true);
        expect(data.posts[0].title).toBe('My Published Works!');
        expect(data.posts[0].body).toBe('Lorem ipsum.');
    });
});

describe('myPosts', () => {
    test('should return all posts when authenticated', async() => {
        const client = getClient(userOne.jwt);
        const { data } = await client.query({ query: myPostsGQL });
        expect(data.myPosts.length).toBe(2);
    });
});

describe('updatePost', () => {
    test('should be able to update own post', async() => {
        const client = getClient(userOne.jwt);
        const mutation = gql`
            mutation {
                updatePost(
                    id: "${posts[0].post.id}",
                    data: {
                        published: false
                    }
                ) {
                    id
                    title
                    body
                    published
                }
            }
        `;
        const { data } = await client.mutate({ mutation });
        expect(data.updatePost.published).toBe(false);

        const exists = await prisma.exists.Post({ id: posts[0].post.id, published: false });
        expect(exists).toBe(true);
    });
});

describe('createPost', () => {
    test('should be able to create a post', async() => {
        const client = getClient(userOne.jwt);
        const mutation = gql`
            mutation {
                createPost(
                    data: {
                        title: "War and Peace",
                        body: "???",
                        published: true
                    }
                ) {
                    id
                    title
                    body
                    published
                }
            }
        `;
        const { data } = await client.mutate({ mutation });
        expect(data.createPost.title).toBe('War and Peace');
        expect(data.createPost.body).toBe('???');
        expect(data.createPost.published).toBe(true);
    });
});

describe('deletePost', () => {
    test('should be able to create a post', async() => {
        const client = getClient(userOne.jwt);
        const mutation = gql`
            mutation {
                deletePost(
                    id: "${posts[1].post.id}"
                ) {
                    id
                }
            }
        `;
        await client.mutate({ mutation });
        const exists = await prisma.exists.Post({ id: posts[1].post.id });
        expect(exists).toBe(false);
    });
});
