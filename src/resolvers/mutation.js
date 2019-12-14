import bcrypt from 'bcrypt';
import utilGetUserId from '../utils/getUserId';
import generateToken, { SECRET } from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const getUserId = (request) => utilGetUserId(request, SECRET);

const Mutation = {
    async createComment(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({ id: data.post, published: true });
        if (!postExists) {
            throw new Error('unable to create comment on unpublished post');
        }

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
        const password = await hashPassword(data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...data,
                password,
            } });

        return {
            user,
            token: generateToken(user.id)
        };
    },
    async deleteComment(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({ id, author: { id: userId } });
        if (!commentExists) {
            throw new Error('unable to delete comment');
        }

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
            token: generateToken(user.id)
        };
    },
    async updateComment(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({ id, author: { id: userId } });
        if (!commentExists) {
            throw new Error('unable to update comment');
        }

        return prisma.mutation.updateComment({ where: { id }, data }, info);
    },
    async updatePost(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({ id, author: { id: userId } });
        if (!postExists) {
            throw new Error('unable to update post');
        }

        const isPublished = await prisma.exists.Post({ id, published: true });
        if (isPublished && !data.published) {
            await prisma.mutation.deleteManyComments({ where: { post: { id } } });
        }

        return prisma.mutation.updatePost({ where: { id }, data }, info);
    },
    async updateUser(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);

        if (typeof data.password === 'string') {
            data.password = await hashPassword(data.password);
        }
        return prisma.mutation.updateUser({ where: { id: userId }, data }, info);
    },
};

export { Mutation as default };
