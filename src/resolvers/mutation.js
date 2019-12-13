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
    createPost(parent, args, { db, pubsub }) {
        const author = db.users.find(user => user.id == args.data.author);
        if (!author) {
            throw new Error('author not found');
        }

        const post = { id: uuidv4(), ...args.data };
        db.posts.push(post);

        if (post.published) {
            pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
        }

        return post;
    },
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email });
        if (emailTaken) {
            throw new Error(`email taken: ${args.data.email}`);
        }

        return prisma.mutation.createUser({ data: args.data }, info);
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
    deleteUser(parent, args, { db }) {
        const userIndex = db.users.findIndex(user => user.id == args.id);
        if (userIndex == -1) {
            throw new Error(`user id ${args.id} not found`);
        }

        const deletedUser = db.users.splice(userIndex, 1)[0];

        db.posts = db.posts.filter(post => {
            const match = post.author == args.id;

            if (match) {
                db.comments = db.comments.filter(comment => comment.post != post.id);
            }

            return !match;
        });
        db.comments = db.comments.filter(comment => comment.author != args.id);

        return deletedUser;
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
    updateUser(parent, { id, data }, { db }) {
        const user = db.users.find(user => user.id == id);
        if (!user) {
            throw new Error(`user id ${id} not found`);
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email);
            if (emailTaken) {
                throw new Error(`email ${data.email} taken`);
            }
            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        }

        return user;
    },
};

export { Mutation as default };
