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

async function seedDatabase() {
    // delete test data
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

    // create posts
    await prisma.mutation.createPost({
        data: {
            author: { connect: { id: userOne.user.id } },
            title: 'My Published Works!',
            body: 'Lorem ipsum.',
            published: true,
        }
    });
    await prisma.mutation.createPost({
        data: {
            author: { connect: { id: userOne.user.id } },
            title: 'In Draft',
            body: 'TBD',
            published: false,
        }
    });
}

module.exports.seedDatabase = seedDatabase;
module.exports.userOne = userOne;
