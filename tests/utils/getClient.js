'use strict';
const { default: ApolloClient } = require('apollo-boost');

module.exports = getClient;

function getClient() {
    return new ApolloClient({
        uri: `http://localhost:${process.env.PORT}`
    });
}
