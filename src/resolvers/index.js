import { extractFragmentReplacements } from 'prisma-binding';
import Query from './query';
import Mutation from './mutation';
import Subscription from './subscription';
import Comment from './comment';
import Post from './post';
import User from './user';

const resolvers = {
    Query,
    Mutation,
    Subscription,
    Comment,
    Post,
    User,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { fragmentReplacements, resolvers };
