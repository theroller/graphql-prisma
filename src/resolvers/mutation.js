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
    createUser(parent, { data }, { prisma }, info) {
        return prisma.mutation.createUser({ data }, info);
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
