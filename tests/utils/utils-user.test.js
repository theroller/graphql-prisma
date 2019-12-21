const { getFirstName, isValidPassword } = require('../../src/utils/user');

describe('getFirstName', () =>{

    test('full name => first name', () => {
        const fullname = 'John Doe';
        const firstName = getFirstName(fullname);
        expect(firstName).toBe('John');
    });

    test('first name => first name', () => {
        const fullname = 'John';
        const firstName = getFirstName(fullname);
        expect(firstName).toBe('John');
    });
});

describe('isValidPassword', () => {

    test('password shorter than 8 characters => reject', () => {
        const password = '1234567';
        const isValid = isValidPassword(password);
        expect(isValid).toBe(false);
    });

    test('password contains "password" => reject', () => {
        const password = 'abcPassword123';
        const isValid = isValidPassword(password);
        expect(isValid).toBe(false);
    });

    test('password is valid => accepts', () => {
        const password = 'test1234';
        const isValid = isValidPassword(password);
        expect(isValid).toBe(true);
    });
});
