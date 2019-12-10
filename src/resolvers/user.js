const User = {
    comments(parent, args, { db }) {
        return db.comments.filter(comment => comment.author == parent.id);
    },
    posts(parent, args, { db }) {
        return db.posts.filter(post => post.author == parent.id);
    },
};

export { User as default };
