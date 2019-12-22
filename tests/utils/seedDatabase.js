'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../src/prisma');

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

    // create post one
    posts[0].post = await prisma.mutation.createPost({
        data: {
            ...posts[0].input,
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
module.exports.posts = posts;
module.exports.users = users;
