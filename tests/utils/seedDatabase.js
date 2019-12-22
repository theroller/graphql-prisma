'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../src/prisma');

const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('P@ssword!1234', 10),
    },
    user: undefined,
    jwt: undefined,
};

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
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

    // create post one
    posts[0].post = await prisma.mutation.createPost({
        data: {
            ...posts[0].input,
            author: { connect: { id: userOne.user.id } },
        }
    });

    // create post two
    posts[1].post = await prisma.mutation.createPost({
        data: {
            ...posts[1].input,
            author: { connect: { id: userOne.user.id } },
        }
    });
}

module.exports.seedDatabase = seedDatabase;
module.exports.posts = posts;
module.exports.userOne = userOne;
