import bcrypt from 'bcrypt';

function hashPassword(password) {
    if (password.length < 8) {
        throw new Error('password must be at least 8 characters');
    }
    return bcrypt.hash(password, 10);
}

export { hashPassword as default };
