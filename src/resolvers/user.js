import utilGetUserId from '../utils/getUserId';

const SECRET = 'secret1234';
const getUserId = (request, requireAuth) => utilGetUserId(request, SECRET, requireAuth);

const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }) {
            const userId = getUserId(request, false);
            if (userId && userId === parent.id) {
                return parent.email;
            }

            return null;
        }
    },
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: { id: parent.id }
                }
            });
        }
    },
};

export { User as default };
