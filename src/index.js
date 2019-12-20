import './env';
import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import { fragmentReplacements, resolvers } from './resolvers';
import prisma from './prisma';

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
