import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
});

// prisma.query.users(null, '{ id name email posts { id title } }')
//     .then(data => {
//         console.log('users query:');
//         console.log(JSON.stringify(data, null, 2));
//     });

// prisma.query.comments(null, '{ id text author { id name } post { id title }}')
//     .then(data => {
//         console.log('comments query:');
//         console.log(JSON.stringify(data, null, 2));
//     });

// prisma.mutation.createPost({
//     data: {
//         title: 'GraphQL 101',
//         body: 'TBD',
//         published: true,
//         author: {
//             connect: {
//                 id: 'ck40a2rpd007t0930bq2ngh1o'
//             }
//         }
//     }
// }, '{ id title body published }').then(data => {
//     console.log(JSON.stringify(data, null, 2));
//     return prisma.query.users(null, '{ id name email posts { id title } }');
// }).then(data => {
//     console.log(JSON.stringify(data, null, 2));
// });

prisma.mutation.updatePost({
    where: {
        id: 'ck40h8wfa00ie09307l6jqi2j'
    },
    data: {
        body: 'Heebee Jeebees'
    }
}, null).then(() => {
    return prisma.query.posts(null, '{ id title body published }');
}).then(data => {
    console.log(JSON.stringify(data, null, 2));
});
