'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../src/prisma');

const comments = [
    {
        input: {
            text: 'Great post. Thanks for sharing'
        },
        comment: undefined,
    },
    {
        input: {
            text: 'Twas alright.'
        },
        comment: undefined,
    },
];

const users = [
    {
        input: {
            name: 'Jen',
            email: 'jen@example.com',
            password: bcrypt.hashSync('P@ssword!1234', 10),
        },
        user: undefined,
        jwt: undefined,
    },
    {
        input: {
            name: 'Jack',
            email: 'jack@example.com',
            password: bcrypt.hashSync('awesome-BIRD1', 10),
        },
        user: undefined,
        jwt: undefined,
    },
];

const posts = [
    {
        input: {
            title: 'My Published Works!',
            body: 'Lorem ipsum.',
            published: true,
        },
        post: undefined,
    },{
        input: {
            title: 'In Draft',
            body: 'TBD',
            published: false,
        },
        post: undefined,
    }
];

async function seedDatabase() {
    // delete test data
    await prisma.mutation.deleteManyComments();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // create user one
    users[0].user = await prisma.mutation.createUser({
        data: users[0].input
    });
    users[0].jwt = jwt.sign({ userId: users[0].user.id }, process.env.JWT_SECRET);

    // create user two
    users[1].user = await prisma.mutation.createUser({
        data: users[1].input
    });
    users[1].jwt = jwt.sign({ userId: users[1].user.id }, process.env.JWT_SECRET);

    // create post one
    posts[0].post = await prisma.mutation.createPost({
        data: {
            ...posts[0].input,
            author: { connect: { id: users[0].user.id } },
        }
    });

    // create comment one on post one
    comments[0].comment = await prisma.mutation.createComment({
        data: {
            ...comments[0].input,
            post: { connect: { id: posts[0].post.id } },
            author: { connect: { id: users[1].user.id } },
        }
    });

    // create comment two on post one
    comments[1].comment = await prisma.mutation.createComment({
        data: {
            ...comments[1].input,
            post: { connect: { id: posts[0].post.id } },
            author: { connect: { id: users[0].user.id } },
        }
    });

    // create post two
    posts[1].post = await prisma.mutation.createPost({
        data: {
            ...posts[1].input,
            author: { connect: { id: users[0].user.id } },
        }
    });
}

module.exports.seedDatabase = seedDatabase;
module.exports.comments = comments;
module.exports.posts = posts;
module.exports.users = users;
