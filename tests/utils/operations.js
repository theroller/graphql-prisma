const { gql } = require('apollo-boost');

const createUser = gql`
    mutation($data: CreateUserInput!) {
        createUser(data: $data) {
            token,
            user {
                id
                name
                email
            }
        }
    }
`;
const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`;
const login = gql`
    mutation($data: LoginUserInput!) {
        login(data: $data){
            token
            user {
                name
            }
        }
    }
`;
const me = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;
const myPosts = gql`
    query {
        myPosts {
            id
            title
            body
            published
        }
    }
`;
const posts = gql`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`;

module.exports = {
    createUser,
    getUsers,
    login,
    me,
    myPosts,
    posts,
};
