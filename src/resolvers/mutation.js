import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import utilGetUserId from '../utils/getUserId';

const SECRET = 'secret1234';
const getUserId = (request) => utilGetUserId(request, SECRET);

const Mutation = {
    createComment(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.createComment({ data: {
            text: data.text,
            author: { connect: { id: userId } },
            post: { connect: { id: data.post } },
        } }, info);
    },
    createPost(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.createPost({ data: {
            title: data.title,
            body: data.body,
            published: data.published,
            author: { connect: { id: userId } }
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
    async deletePost(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({ id, author: { id: userId } });
        if (!postExists) {
            throw new Error('unable to delete post');
        }

        return prisma.mutation.deletePost({ where: { id } }, info);
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.deleteUser({ where: { id: userId } }, info);
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
    async updatePost(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({ id, author: { id: userId } });
        if (!postExists) {
            throw new Error('unable to update post');
        }

        return prisma.mutation.updatePost({ where: { id }, data }, info);
    },
    updateUser(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.updateUser({ where: { id: userId }, data }, info);
    },
};

export { Mutation as default };
