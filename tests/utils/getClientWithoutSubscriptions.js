'use strict';
const { default: ApolloClient } = require('apollo-boost');

module.exports = getClient;

function getClient(jwt) {
    return new ApolloClient({
        uri: `http://localhost:${process.env.PORT}`,
        request(operation) {
            if (jwt) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
            }
        },
    });
}
