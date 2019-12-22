require('cross-fetch/polyfill');

const { gql } = require('apollo-boost');
const getClient = require('./utils/getClient');
const { seedDatabase, userOne } = require('./utils/seedDatabase');

const client = getClient();

beforeEach(seedDatabase);

describe('getPosts', () => {

    test('should expose published posts', async() => {
        const getPosts = gql`
        query {
            posts {
                id
                title
                body
                published
             }
        }
    `;
        const { data } = await client.query({ query: getPosts });
        expect(data.posts.length).toBe(1);
        expect(data.posts[0].published).toBe(true);
        expect(data.posts[0].title).toBe('My Published Works!');
        expect(data.posts[0].body).toBe('Lorem ipsum.');
    });
});

describe('myPosts', () => {
    test('should return all posts when authenticated', async() => {
        const client = getClient(userOne.jwt);
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
        const { data } = await client.query({ query: myPosts });
        expect(data.myPosts.length).toBe(2);
    });
});
