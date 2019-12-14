import jwt from 'jsonwebtoken';

const SECRET = 'secret1234';

function generateToken(userId, expiresIn='1day') {
    return jwt.sign({ userId }, SECRET, { expiresIn });
}

export { SECRET, generateToken as default };
