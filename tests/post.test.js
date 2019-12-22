require('cross-fetch/polyfill');

const { default: ApolloClient, gql } = require('apollo-boost');
const seedDatabase = require('./utils/seedDatabase');

const client = new ApolloClient({ uri: `http://localhost:${process.env.PORT}` });

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
