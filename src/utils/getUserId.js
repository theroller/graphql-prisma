import jwt from 'jsonwebtoken';

function getUserId(request, secret, requireAuth = true) {
    const header = request.request ?
        request.request.headers.authentication :
        request.connection.context.Authentication;

    if (header) {
        const token = header.split(/\s+/)[1];
        const decoded = jwt.verify(token, secret);
        return decoded.userId;
    }

    if (requireAuth) {
        throw new Error('Authentication required');
    }

    return null;
}

export { getUserId as default };
