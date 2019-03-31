import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
//import { setContext } from 'apollo-link-context';
import PropTypes from "prop-types";


/*
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = Meteor.user().services.github.accessToken;
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});
*/
const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' });
const cache = new InMemoryCache().restore(window.__APOLLO_STATE__);

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = Meteor.user().services.github.accessToken;
    // add the authorization to the headers
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        }
    });
    return forward(operation).map(response => {
        if (response.errors !== undefined && response.errors.length > 0) {
            response.data.errors = response.errors;
        }
        return response;
    });
});


const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    //link: authLink.concat(link),
    cache: cache,
});

/*
export default (
    ({ children }) => (
        <ApolloProvider client={client}>{children}</ApolloProvider>
    )
);

*/

class ApolloProviderGithub extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;
        return (
            <ApolloProvider client={client}>{children}</ApolloProvider>
        );
    }
}

ApolloProviderGithub.propTypes = {
    children: PropTypes.array.isRequired,
};

export default ApolloProviderGithub;