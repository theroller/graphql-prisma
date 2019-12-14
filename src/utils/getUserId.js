import jwt from 'jsonwebtoken';

function getUserId(request, secret) {
    const header = request.request.headers.authentication;
    if (!header) {
        throw new Error('Authentication required');
    }

    const token = header.split(/\s+/)[1];
    const decoded = jwt.verify(token, secret);

    return decoded.userId;
}

export { getUserId as default };
