const getClient = require('./utils/getClient');
const ops = require('./utils/operations');
const prisma = require('../src/prisma');
const { seedDatabase, comments, posts, users } = require('./utils/seedDatabase');

const client = getClient();

beforeEach(seedDatabase);

describe('deleteComment', () => {
    test('should be able to delete own comment', async() => {
        const client = getClient(users[0].jwt);
        const variables = {
            id: comments[1].comment.id
        };
        await client.mutate({ mutation: ops.deleteComment, variables });
        const exists = await prisma.exists.Comment({ id: comments[1].comment.id });
        expect(exists).toBe(false);
    });

    test('should not be able to delete someone else\'s comment', async() => {
        const client = getClient(users[0].jwt);
        const variables = {
            id: comments[0].comment.id
        };
        await expect(client.mutate({ mutation: ops.deleteComment, variables })).rejects.toThrow();
    });
});

describe('subscription to comment', () => {
    test('should subscribe to comments for a post', async(done) => {
        const variables = {
            postID: posts[0].post.id
        };
        client.subscribe({ query: ops.subscribeToComments, variables }).subscribe({
            next(response) {
                expect(response.data.comment.mutation).toBe('DELETED');
                done();
            }
        });

        // change a comment
        await prisma.mutation.deleteComment({ where: { id: comments[0].comment.id } });
    });
});
