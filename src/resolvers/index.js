const { extractFragmentReplacements } = require('prisma-binding');
const Query = require('./query');
const Mutation = require('./mutation');
const Subscription = require('./subscription');
const Comment = require('./comment');
const Post = require('./post');
const User = require('./user');

const resolvers = {
    Query,
    Mutation,
    Subscription,
    Comment,
    Post,
    User,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

module.exports.fragmentReplacements = fragmentReplacements;
module.exports.resolvers = resolvers;
