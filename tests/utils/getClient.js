'use strict';

// First up, install the modules necessary with the following command
// npm i apollo-{client,cache-inmemory,link,utilities} apollo-link-{http,error,ws} subscriptions-transport-ws

const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { HttpLink } = require('apollo-link-http');
const { onError } = require('apollo-link-error');
const { ApolloLink, Observable } = require('apollo-link');
const { WebSocketLink } = require('apollo-link-ws');
const { getMainDefinition } = require('apollo-utilities');

module.exports = getClient;

function getClient(jwt, httpURL = `http://localhost:${process.env.PORT}`, websocketURL = `ws://localhost:${process.env.PORT}`) {

    // Setup the authorization header for the http client
    function request(operation) {
        if (jwt) {
            operation.setContext({
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
        }
    }

    // Setup the request handlers for the http clients
    const requestLink = new ApolloLink((operation, forward) => {
        return new Observable((observer) => {
            let handle;
            Promise.resolve(operation)
                .then((oper) => {
                    request(oper);
                })
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                    });
                })
                .catch(observer.error.bind(observer));

            return () => {
                if (handle) {
                    handle.unsubscribe();
                }
            };
        });
    });

    // Web socket link for subscriptions
    const wsLink = ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.map(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            }

            if (networkError) {
                console.log(`[Network error]: ${networkError}`);
            }
        }),
        requestLink,
        new WebSocketLink({
            uri: websocketURL,
            options: {
                reconnect: true,
                connectionParams: () => {
                    if (jwt) {
                        return {
                            Authorization: `Bearer ${jwt}`,
                        };
                    }
                }
            }
        })
    ]);

    // HTTP link for queries and mutations
    const httpLink = ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.map(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            }
            if (networkError) {
                console.log(`[Network error]: ${networkError}`);
            }
        }),
        requestLink,
        new HttpLink({
            uri: httpURL,
            credentials: 'same-origin'
        })
    ]);

    // Link to direct ws and http traffic to the correct place
    const link = ApolloLink.split(
        // Pick which links get the data based on the operation kind
        ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLink,
    );


    return new ApolloClient({
        link,
        cache: new InMemoryCache()
    });
}
