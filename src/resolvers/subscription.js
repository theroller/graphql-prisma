const Subscription = {
    comment: {
        subscribe(parent, { postID }, { prisma }, info) {
            return prisma.subscription.comment({
                where: { node: { post: { id: postID } } }
            }, info);
        }
    },
    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
                where: { node: { published: true } }
            }, info);
        }
    }
};

export { Subscription as default };
