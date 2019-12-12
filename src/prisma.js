import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
});

createPostForUser('ck3zbyjg3008107077814r9kj',
    {
        title: 'Great Books to Read',
        body: 'The War of Art',
        published: true,
    })
    .then(user => console.log(JSON.stringify(user, null, 2)))
    .catch(console.error);

// updatePostForUser('ck42006xe007d0730ifrh0sko', { title: 'Great Books??' })
//     .then(data => console.log(JSON.stringify(data, null, 2)));

async function createPostForUser(authorID, data) {
    const userExists = await prisma.exists.User({ id: authorID });
    if (!userExists) {
        throw new Error(`user id: ${authorID} not found`);
    }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: { id: authorID }
            }
        }
    }, '{ author { id name email posts { id title published } } }');

    return post.author;
}

async function updatePostForUser(postID, data) {
    const { author } = await prisma.mutation.updatePost({
        where: { id: postID },
        data,
    }, '{ author { id } }');

    return await prisma.query.user({
        where: { id: author.id }
    }, '{ id name email posts { id title published } }');
}
