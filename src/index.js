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

server.start(() => {
    console.log('server is up');
});
