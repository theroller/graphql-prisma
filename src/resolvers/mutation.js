import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = 'secret1234';

const Mutation = {
    createComment(parent, { data }, { prisma }, info) {
        return prisma.mutation.createComment({ data: {
            text: data.text,
            author: { connect: { id: data.author } },
            post: { connect: { id: data.post } },
        } }, info);
    },
    createPost(parent, { data }, { prisma }, info) {
        return prisma.mutation.createPost({ data: {
            title: data.title,
            body: data.body,
            published: data.published,
            author: { connect: { id: data.author } }
        } }, info);
    },
    async createUser(parent, { data }, { prisma }) {
        if (data.password.length < 8) {
            throw new Error('password must be at least 8 characters');
        }

        const password = await bcrypt.hash(data.password, 10);
        const user = await prisma.mutation.createUser({
            data: {
                ...data,
                password,
            } });

        return {
            user,
            token: jwt.sign({ userId: user.id }, SECRET)
        };
    },
    deleteComment(parent, { id }, { prisma }, info) {
        return prisma.mutation.deleteComment({ where: { id } }, info);
    },
    deletePost(parent, { id }, { prisma }, info) {
        return prisma.mutation.deletePost({ where: { id } }, info);
    },
    deleteUser(parent, { id }, { prisma }, info) {
        return prisma.mutation.deleteUser({ where: { id } }, info);
    },
    async login(parent, { data }, { prisma }) {
        const user = await prisma.query.user({ where: { email: data.email } });
        if (!user) {
            throw new Error('login failed');
        }

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            throw new Error('login failed');
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, SECRET)
        };
    },
    updateComment(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updateComment({ where: { id }, data }, info);
    },
    updatePost(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updatePost({ where: { id }, data }, info);
    },
    updateUser(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updateUser({ where: { id }, data }, info);
    },
};

export { Mutation as default };
