const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret1234';

function generateToken(userId, expiresIn='1day') {
    return jwt.sign({ userId }, SECRET, { expiresIn });
}

module.exports = generateToken;
module.exports.SECRET = SECRET;
