'use strict';

const { GraphQLServer, PubSub } = require('graphql-yoga');

const { fragmentReplacements, resolvers } = require('./resolvers');
const prisma = require('./prisma');

const pubsub = new PubSub();

const server = new GraphQLServer({
    context(request) {
        return {
            pubsub,
            prisma,
            request,
        };
    },
    fragmentReplacements,
    resolvers,
    typeDefs: './src/schema.graphql',
});

module.exports = server;
