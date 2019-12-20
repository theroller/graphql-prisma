require('./env');
const { GraphQLServer, PubSub } = require('graphql-yoga');

const db = require('./db');
const { fragmentReplacements, resolvers } = require('./resolvers');
const prisma = require('./prisma');

const pubsub = new PubSub();

const server = new GraphQLServer({
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request,
        };
    },
    fragmentReplacements,
    resolvers,
    typeDefs: './src/schema.graphql',
});

const serverConfig = {
    port: process.env.PORT || 4000,
};
server.start(serverConfig, () => {
    console.log(`server is up on port ${serverConfig.port}`);
});
