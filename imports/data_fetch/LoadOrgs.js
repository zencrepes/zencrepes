import React, { Component } from 'react';

import GET_GH_ORGANIZATIONS from '../graphql/getOrgs.graphql';
export const gh_organizations = new Mongo.Collection('gh_organizations', {connection: null});
export const local_gh_organizations = new PersistentMinimongo2(gh_organizations, 'git-pmview');

import calculateQueryIncrement from './utils/calculateQueryIncrement.js';

import {LoadRepos} from './LoadRepos.js'

/* Assume that for any new organizations, we want to get its repos */
gh_organizations.after.insert(function(userId, doc) {
    console.log('LoadOrgs: Added Org: ' + doc.login);
    if (doc.repo_count > 0 && window.store_autoupdate === true) {
        LoadRepos(window.client, doc.login);
    }
});

const loadOrganizations = (data, client) => {
    lastCursor = null;
    for (let [key, currentOrg] of Object.entries(data.data.viewer.organizations.edges)){
        gh_organizations.insert({
            _id: currentOrg.node.id,
            name: currentOrg.node.name,
            login: currentOrg.node.login,
            url: currentOrg.node.url,
            repo_count: currentOrg.node.repositories.totalCount,
        });
        lastCursor = currentOrg.cursor
    }
    return lastCursor;
}


/* Get Github organizations with pagination */
const getOrgsPagination = (client, cursor, increment) => {
    client.query({
        query: GET_GH_ORGANIZATIONS,
        variables: {repo_cursor: cursor, increment: increment}
    }).then(data => {
        lastCursor = loadOrganizations(data, client);
        queryIncrement = calculateQueryIncrement(gh_organizations.find({}).count(), data.data.viewer.organizations.totalCount)
        if (queryIncrement > 0) {
            getOrgsPagination(client, lastCursor, queryIncrement);
        }
    });
}

const initialLoad = (client) => {
    console.log('LoadOrgs: Starting to load all GitHub Organizations for logged-in user')
    getOrgsPagination(client, null, 10);
}

export const LoadOrgs = initialLoad;
