import uuidv4 from 'uuid/v4';

const Mutation = {
    createComment(parent, args, { db, pubsub }) {
        const author = db.users.find(user => user.id == args.data.author);
        if (!author) {
            throw new Error('author not found');
        }
        const post = db.posts.find(post => post.id == args.data.post && post.published);
        if (!post) {
            throw new Error('published post not found');
        }

        const comment = { id: uuidv4(), ...args.data };
        db.comments.push(comment);

        pubsub.publish(`comment-${args.data.post}`, { comment: { mutation: 'CREATED', data: comment } });

        return comment;
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
    deleteComment(parent, args, { db, pubsub }) {
        const commentIndex = db.comments.findIndex(comment => comment.id == args.id);
        if (commentIndex == -1) {
            throw new Error(`comment id ${args.id} not found`);
        }

        const deletedComment = db.comments.splice(commentIndex, 1)[0];

        pubsub.publish(`comment-${deletedComment.post}`, { comment: { mutation: 'DELETED', data: deletedComment } });

        return deletedComment;
    },
    deletePost(parent, args, { db, pubsub }) {
        const postIndex = db.posts.findIndex(post => post.id == args.id);
        if (postIndex == -1) {
            throw new Error(`post id ${args.id} not found`);
        }

        const deletedPost = db.posts.splice(postIndex, 1)[0];
        db.comments = db.comments.filter(comment => comment.post != args.id);

        if (deletedPost.published) {
            pubsub.publish('post', { post: { mutation: 'DELETED', data: deletedPost } });
        }

        return deletedPost;
    },
    deleteUser(parent, args, { prisma }, info) {
        return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
    },
    updateComment(parent, { id, data }, { db, pubsub }) {
        const comment = db.comments.find(comment => comment.id == id);
        if (!comment) {
            throw new Error(`comment id ${id} not found`);
        }

        if (typeof data.text === 'string') {
            comment.text = data.text;
        }

        pubsub.publish(`comment-${comment.post}`, { comment: { mutation: 'UPDATED', data: comment } });

        return comment;
    },
    updatePost(parent, { id, data }, { db, pubsub }) {
        const post = db.posts.find(post => post.id == id);
        if (!post) {
            throw new Error(`post id ${id} not found`);
        }

        const origPost = { ...post };

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (origPost.published && !data.published) {
                pubsub.publish('post', { post: { mutation: 'DELETED', data: origPost } });
            } else if (!origPost.published && data.published) {
                pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
            }
        } else if (post.published) {
            pubsub.publish('post', { post: { mutation: 'UPDATED', data: post } });
        }

        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        return post;
    },
    updateUser(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updateUser({ where: { id }, data }, info);
    },
};

export { Mutation as default };
