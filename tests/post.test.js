const getClient = require('./utils/getClient');
const ops = require('./utils/operations');
const prisma = require('../src/prisma');
const { seedDatabase, posts, users } = require('./utils/seedDatabase');

const client = getClient();

beforeEach(seedDatabase);

describe('getPosts', () => {
    test('should expose published posts', async() => {
        const { data } = await client.query({ query: ops.posts });
        expect(data.posts.length).toBe(1);
        expect(data.posts[0].published).toBe(true);
        expect(data.posts[0].title).toBe('My Published Works!');
        expect(data.posts[0].body).toBe('Lorem ipsum.');
    });
});

describe('myPosts', () => {
    test('should return all posts when authenticated', async() => {
        const client = getClient(users[0].jwt);
        const { data } = await client.query({ query: ops.myPosts });
        expect(data.myPosts.length).toBe(2);
    });
});

describe('updatePost', () => {
    test('should be able to update own post', async() => {
        const client = getClient(users[0].jwt);
        const variables = {
            id: posts[0].post.id,
            data: {
                published: false
            }
        };
        const { data } = await client.mutate({ mutation: ops.updatePost, variables });
        expect(data.updatePost.published).toBe(false);

        const exists = await prisma.exists.Post({ id: posts[0].post.id, published: false });
        expect(exists).toBe(true);
    });
});

describe('createPost', () => {
    test('should be able to create a post', async() => {
        const client = getClient(users[0].jwt);
        const variables = {
            data: {
                title: 'War and Peace',
                body: '???',
                published: true
            }
        };
        const { data } = await client.mutate({ mutation: ops.createPost, variables });
        expect(data.createPost.title).toBe('War and Peace');
        expect(data.createPost.body).toBe('???');
        expect(data.createPost.published).toBe(true);
    });
});

describe('deletePost', () => {
    test('should be able to create a post', async() => {
        const client = getClient(users[0].jwt);
        const variables = {
            id: posts[1].post.id
        };
        await client.mutate({ mutation: ops.deletePost, variables });
        const exists = await prisma.exists.Post({ id: posts[1].post.id });
        expect(exists).toBe(false);
    });
});

describe('subscription to posts', () => {
    test('should subscribe to post changes', async(done) => {
        client.subscribe({ query: ops.subscribeToPosts }).subscribe({
            next(response) {
                expect(response.data.post.mutation).toBe('DELETED');
                done();
            }
        });

        // change a post
        await prisma.mutation.deletePost({ where: { id: posts[0].post.id } });
    });
});
