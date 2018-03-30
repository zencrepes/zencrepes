import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Accounts } from 'meteor/accounts-base';

import { Provider } from "react-redux";
import store from "../imports/store/index";

import App from '../imports/ui/App.js';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';

import injectTapEventPlugin from 'react-tap-event-plugin';

import { local_gh_issues } from '../imports/data_fetch/LoadIssues.js'
import { local_gh_repositories } from '../imports/data_fetch/LoadRepos.js'
import { local_gh_organizations } from '../imports/data_fetch/LoadOrgs.js'

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

const client = new ApolloClient({
    link: authLink.concat(new HttpLink({ uri: 'https://api.github.com/graphql' })),
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

window.client = client;
window.store_autoupdate = false;

//Set-up Org-level permissions
if (Meteor.isClient){
    var scopes = ['user:email','read:org']
    Accounts.ui.config({'requestPermissions':{'github':scopes}});
}

Meteor.startup(() => {
    injectTapEventPlugin();
    Meteor.setTimeout(function() {
        local_gh_issues.refresh()
        local_gh_repositories.refresh()
        local_gh_organizations.refresh()

        if (Meteor.user() !== undefined) {
            render(
                < ApolloProvider client = {client} >
                    <Provider store={store}>
                        < App />
                    </Provider>
                </ ApolloProvider >,
                document.getElementById('render-target')
            );
        }
    }, 500);
});

/*
Meteor.startup(() => {
    if (Meteor.userId() !== null) {
        render(<App />, document.getElementById('render-target'));
    }
});
*/