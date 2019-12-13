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
    deletePost(parent, { id }, { prisma }, info) {
        return prisma.mutation.deletePost({ where: { id } }, info);
    },
    deleteUser(parent, { id }, { prisma }, info) {
        return prisma.mutation.deleteUser({ where: { id } }, info);
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
    updatePost(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updatePost({ where: { id }, data }, info);
    },
    updateUser(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updateUser({ where: { id }, data }, info);
    },
};

export { Mutation as default };
