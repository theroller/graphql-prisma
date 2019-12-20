const utilGetUserId = require('../utils/getUserId');
const { SECRET } = require('../utils/generateToken');

const getUserId = (request, requireAuth) => utilGetUserId(request, SECRET, requireAuth);

const Subscription = {
    comment: {
        subscribe(parent, { postID }, { prisma }, info) {
            return prisma.subscription.comment({
                where: { node: { post: { id: postID } } }
            }, info);
        }
    },
    myPost: {
        subscribe(parent, args, { prisma, request }, info) {
            const userId = getUserId(request);
            if (!userId) {
                throw new Error('not authorized');
            }

            return prisma.subscription.post({
                where: { node: { author: { id: userId } } }
            }, info);
        }
    },
    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
                where: { node: { published: true } }
            }, info);
        }
    },
};

module.exports = Subscription;
