const Query = {
    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info);
    },
    me(parent, args, { db }) {
        return db.users[0];
    },
    post(parent, args, { db }) {
        return db.posts[0];
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                OR: [
                    { body_contains: args.query },
                    { title_contains: args.query }
                ]
            };
        }

        return prisma.query.posts(opArgs, info);
    },
    users(parent, args, { prisma }, info) {
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                OR: [
                    { name_contains: args.query },
                    { email_contains: args.query }
                ]
            };
        }

        return prisma.query.users(opArgs, info);
    },
};

export { Query as default };
