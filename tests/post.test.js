require('cross-fetch/polyfill');

const { gql } = require('apollo-boost');
const getClient = require('./utils/getClient');
const seedDatabase = require('./utils/seedDatabase');

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
        const response = await client.query({ query: getPosts });
        expect(response.data.posts.length).toBe(1);
        expect(response.data.posts[0].published).toBe(true);
        expect(response.data.posts[0].title).toBe('My Published Works!');
        expect(response.data.posts[0].body).toBe('Lorem ipsum.');
    });
});
