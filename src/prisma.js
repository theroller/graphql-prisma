import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
});

// createPostForUser('ck3zbyjg3008107077814r9kj',
//     {
//         title: 'Great Books to Read',
//         body: 'The War of Art',
//         published: true,
//     })
//     .then(user => console.log(JSON.stringify(user, null, 2)))
//     .catch(console.error);

updatePostForUser('ck42006xe007d0730ifrh0sko', { title: 'Great Books??!!' })
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(console.error);

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
    const postExists = await prisma.exists.Post({ id: postID });
    if (!postExists) {
        throw new Error(`post id: ${postID} not found`);
    }

    const post = await prisma.mutation.updatePost({
        where: { id: postID },
        data,
    }, '{ author { id name email posts { id title published } } }');

    return post.author;
}
