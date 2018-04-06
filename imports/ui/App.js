import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';

import PropTypes from 'prop-types'
import autoBind from 'react-autobind';

import Login from './pages/login/index.js';
import Dashboard from './pages/dashboard/index.js';
import Index from './Index.js';

import Public from './components/Public/Public.js'
import Authenticated from './components/Authenticated/Authenticated.js'


// Configure Apollo link
const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' });
const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers

    const githubToken = localStorage.getItem('token');
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${githubToken}` : "",
        }
    });

    return forward(operation);
})
const client = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { afterLoginPath: null };
        autoBind(this);
    }

    setAfterLoginPath(afterLoginPath) {
        this.setState({ afterLoginPath });
    }

    render() {
        const { props, state, setAfterLoginPath } = this;
        return (
            <ApolloProvider client={client}>
                <Router>
                    {!props.loading ? (
                        <div className="App">
                            <Switch>
                                <Route exact name="index" path="/" component={Index} />
                                <Public path="/login" component={Login} {...props} {...state} />
                                <Authenticated exact path="/dashboard" component={Dashboard} setAfterLoginPath={setAfterLoginPath} {...props} {...state} />
                            </Switch>
                        </div>
                    ) : ''}
                </Router>
            </ApolloProvider>
        );
    }
}

App.defaultProps = {
    userId: '',
    emailAddress: '',
};

App.propTypes = {
    loading: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    emailAddress: PropTypes.string,
    emailVerified: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
};

const getUserName = name => ({
    string: name,
    object: `${name.first} ${name.last}`,
}[typeof name]);


export default withTracker(() => {
    const loggingIn = Meteor.loggingIn();
    const user = Meteor.user();
    const userId = Meteor.userId();
    const loading = !Roles.subscription.ready();
    const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
    const emailAddress = user && user.emails && user.emails[0].address;

    return {
        loading,
        loggingIn,
        authenticated: !loggingIn && !!userId,
        name: name || emailAddress,
        roles: !loading && Roles.getRolesForUser(userId),
        userId,
        emailAddress,
        emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true,
    };
})(App);