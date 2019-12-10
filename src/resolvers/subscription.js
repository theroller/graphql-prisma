const Subscription = {
    comment: {
        subscribe(parent, { postID }, { db, pubsub }) {
            const post = db.posts.find(post => post.id == postID && post.published);

            if (!post) {
                throw new Error(`post id ${postID} not found`);
            }

            return pubsub.asyncIterator(`comment-${postID}`);
        }
    },
    post: {
        subscribe(parent, args, { pubsub }) {
            return pubsub.asyncIterator('post');
        }
    }
};

export { Subscription as default };
