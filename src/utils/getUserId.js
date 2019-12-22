const jwt = require('jsonwebtoken');

function getUserId(request, secret, requireAuth = true) {
    const header = request.request ?
        request.request.headers.authorization :
        request.connection.context.Authorization;

    if (header) {
        const token = header.split(/\s+/)[1];
        const decoded = jwt.verify(token, secret);
        return decoded.userId;
    }

    if (requireAuth) {
        throw new Error('Authorization required');
    }

    return null;
}

module.exports = getUserId;
