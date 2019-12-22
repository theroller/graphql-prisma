const { gql } = require('apollo-boost');

const createPost = gql`
    mutation($data: CreatePostInput!) {
        createPost(data: $data) {
            id
            title
            body
            published
        }
    }
`;
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
const deletePost = gql`
    mutation($id: ID!) {
        deletePost(id: $id) {
            id
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
const updatePost = gql`
    mutation($id: ID!, $data: UpdatePostInput!) {
        updatePost(
            id: $id,
            data: $data
        ) {
            id
            title
            body
            published
        }
    }
`;

module.exports = {
    createPost,
    createUser,
    deletePost,
    getUsers,
    login,
    me,
    myPosts,
    posts,
    updatePost,
};
