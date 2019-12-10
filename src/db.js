// demo data
const comments = [
    { id: 1, author: 2, post: 4, text: 'it was a dark and stormy night' },
    { id: 2, author: 2, post: 4, text: 'frig yas all' },
    { id: 3, author: 3, post: 2, text: 'too much to do' },
    { id: 4, author: 1, post: 1, text: 'the sky was falling that night' },
];
const posts = [
    { id: 1, author: 1, published: false, title: 'doo wop', body: 'this is a body' },
    { id: 2, author: 3, published: false, title: 'foo bar', body: 'try me' },
    { id: 3, author: 3, published: true, title: 'kitty c', body: 'walk this way' },
    { id: 4, author: 2, published: true, title: 'shrug', body: 'tbd' },
];
const users = [
    { id: 1, name: 'james', email: 'james@gmail.com' },
    { id: 2, name: 'frank', email: 'frank@gmail.com' },
    { id: 3, name: 'jillian', email: 'jillian@gmail.com' },
];

const db = {
    comments,
    users,
    posts,
};

export { db as default };
