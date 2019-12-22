'use strict';

const bcrypt = require('bcrypt');
const prisma = require('../../src/prisma');

module.exports = seedDatabase;

async function seedDatabase() {
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
}
