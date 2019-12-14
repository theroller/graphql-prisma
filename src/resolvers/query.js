import utilGetUserId from '../utils/getUserId';

const SECRET = 'secret1234';
const getUserId = (request, requireAuth) => utilGetUserId(request, SECRET, requireAuth);

const Query = {
    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info);
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.query.user({ where: { id: userId } }, info);
    },
    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const opArgs = {
            where: { author: { id: userId } }
        };
        if (args.query) {
            opArgs.where.OR = [
                { body_contains: args.query },
                { title_contains: args.query }
            ];
        }

        return prisma.query.posts(opArgs, info);
    },
    async post(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request, false);

        const posts = await prisma.query.posts({
            where: {
                id,
                OR: [{
                    published: true
                }, {
                    author: { id: userId }
                }]
            }
        }, info);

        if (posts.length === 0) {
            throw new Error('post not found');
        }

        return posts[0];
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = {
            where: { published: true }
        };
        if (args.query) {
            opArgs.where.OR = [
                { body_contains: args.query },
                { title_contains: args.query }
            ];
        }

        return prisma.query.posts(opArgs, info);
    },
    users(parent, args, { prisma }, info) {
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                OR: [
                    { name_contains: args.query },
                ]
            };
        }

        return prisma.query.users(opArgs, info);
    },
};

export { Query as default };
