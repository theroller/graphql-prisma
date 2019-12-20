const { Prisma } = require('prisma-binding');
const { fragmentReplacements } = require('./resolvers');

const prisma = new Prisma({
    endpoint: process.env.PRISMA_ENDPOINT,
    fragmentReplacements,
    secret: process.env.PRISMA_SERVICE_SECRET,
    typeDefs: 'src/generated/prisma.graphql',
});

module.exports = prisma;
