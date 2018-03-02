import React, { Component } from 'react';

import GET_GH_REPOSITORIES from '../graphql/getRepos.graphql';
export const gh_repositories = new Mongo.Collection('gh_repositories', {connection: null});
export const local_gh_repositories = new PersistentMinimongo2(gh_repositories, 'git-pmview');

import calculateQueryIncrement from './utils/calculateQueryIncrement.js';

import {LoadIssues} from './LoadIssues.js'

gh_repositories.after.insert(function(userId, doc) {
    console.log('LoadRepos: Added Repo: ' + doc.name);
    if (doc.issues_count > 0 && window.store_autoupdate === true) {
        LoadIssues(window.client, doc.org_login, doc.name);
    }
});

const loadRepositories = (data) => {
    lastCursor = null;
    for (let [key, currentRepo] of Object.entries(data.data.viewer.organization.repositories.edges)){
        gh_repositories.insert({
            _id: currentRepo.node.id,
            name: currentRepo.node.name,
            url: currentRepo.node.url,
            issues_count: currentRepo.node.issues.totalCount,
            org_login: data.data.viewer.organization.login,
        });
        console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name)
        lastCursor = currentRepo.cursor
    }
    return lastCursor;
}


/* Get Github organizations with pagination */
const getReposPagination = (client, cursor, increment, org_name) => {
    client.query({
        query: GET_GH_REPOSITORIES,
        variables: {repo_cursor: cursor, increment: increment, org_name: org_name}
    }).then(data => {
        lastCursor = loadRepositories(data);
        queryIncrement = calculateQueryIncrement(gh_repositories.find({ org_login: data.data.viewer.organization.login }).count(), data.data.viewer.organization.repositories.totalCount)
        if (queryIncrement > 0) {
            getReposPagination(client, lastCursor, queryIncrement, org_name);
        }
    });
}

const initialLoad = (client, org_name) => {
    console.log('LoadRepos: Starting to load all Repositories for Github Org: ' + org_name)
    getReposPagination(client, null, 5, org_name);
}

export const LoadRepos = initialLoad;
