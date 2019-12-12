const Query = {
    comments(parent, args, { db }) {
        return db.comments;
    },
    me(parent, args, { db }) {
        return db.users[0];
    },
    post(parent, args, { db }) {
        return db.posts[0];
    },
    posts(parent, args, { prisma }, info) {
        return prisma.query.posts(null, info);

        // if (args.query) {
        //     const re = new RegExp(args.query.toLowerCase());
        //     return db.posts.filter(x => re.test(x.title.toLowerCase()) || re.test(x.body.toLowerCase()));
        // }
        // return db.posts;
    },
    users(parent, args, { prisma }, info) {
        return prisma.query.users(null, info);

        // if (args.query) {
        //     const re = new RegExp(args.query.toLowerCase());
        //     return db.users.filter(x => re.test(x.name.toLowerCase()));
        // }
        // return db.users;
    },
};

export { Query as default };
