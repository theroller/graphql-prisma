import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import Query from './resolvers/query';
import Mutation from './resolvers/mutation';
import Subscription from './resolvers/subscription';
import Comment from './resolvers/comment';
import Post from './resolvers/post';
import User from './resolvers/user';
import './prisma';

const pubsub = new PubSub();

const server = new GraphQLServer({
    context: {
        db,
        pubsub,
    },
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Comment,
        Post,
        User,
    },
});

server.start(() => {
    console.log('server is up');
});
