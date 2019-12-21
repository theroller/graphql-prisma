module.exports.getFirstName = getFirstName;
module.exports.isValidPassword = isValidPassword;

function getFirstName(fullname) {
    return fullname.split(' ')[0];
}

function isValidPassword(password) {
    return password.length >= 8 &&
        !password.toLowerCase().includes('password');
}
