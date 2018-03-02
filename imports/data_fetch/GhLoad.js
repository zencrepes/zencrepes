import React, { Component } from 'react';

import GET_GH_REPOSITORIES from '../graphql/getRepositories.graphql';
import GET_GH_ISSUES from '../graphql/getIssues.graphql';

export const gh_repositories = new Mongo.Collection('gh_repositories', {connection: null});
//export const gh_organizations = new Mongo.Collection('gh_organizations', {connection: null});
export const gh_issues = new Mongo.Collection('gh_issues', {connection: null});
//const gh_members = new Mongo.Collection('gh_issues', {connection: null});

import calculateQueryIncrement from './utils/calculateQueryIncrement.js';

const loadIssues = (data) => {
    for (let [key, currentIssue] of Object.entries(data.data.viewer.organization.repository.issues.edges)){
        gh_issues.insert({
            id: currentIssue.node.id,
            title: currentIssue.node.title,
            url: currentIssue.node.url,
            author: currentIssue.node.author,
            org: data.data.viewer.organization.name,
            repo: data.data.viewer.organization.repository.name,
            state: currentIssue.node.state,
            assignees: currentIssue.node.assignees,
            createdAt: currentIssue.node.createdAt,
            updatedAt: currentIssue.node.updatedAt,
            closedAt: currentIssue.node.closedAt,
        });
        console.log('Issue - Adding: ' + currentIssue.node.title)
        lastCursor = currentIssue.cursor
    }
    return lastCursor;
}

const getIssuesPagination = (client, cursor, increment, org_name, repo_name) => {
    console.log('Loading Issues starting with cursor: ' + cursor + ' from: ' + org_name + '/' + repo_name)
    client.query({
        query: GET_GH_ISSUES,
        variables: {repo_cursor: cursor, increment: increment, org_name: org_name, repo_name: repo_name}
    }).then(data => {
        try {
            if (data.data.viewer.organization.repository.issues.totalCount > 0) {
                lastCursor = loadIssues(data);
            }
            queryIncrement = calculateQueryIncrement(gh_issues, data.data.viewer.organization.repository.issues.totalCount)
            if (queryIncrement > 0) {
                getIssuesPagination(client, lastCursor, queryIncrement);
            }
            console.log('Last Cursor: ' + lastCursor);
        } catch(err) {
            console.log(err)
        }
    });
}

const loadRepositories = (data, client) => {
    lastCursor = null;
    for (let [key, currentRepo] of Object.entries(data.data.viewer.repositories.edges)){
        gh_repositories.insert({
            id: currentRepo.node.id,
            name: currentRepo.node.name,
            owner: currentRepo.node.owner,
            url: currentRepo.node.url,
            issues_count: currentRepo.node.issues.totalCount,
            cursor: currentRepo.cursor
        });
        console.log('Repository - Adding: ' + currentRepo.node.name)

        issues_increment = 100
        if (currentRepo.node.issues.totalCount < 100) {
            issues_increment = currentRepo.node.issues.totalCount
        }
        console.log('Repo: ' + currentRepo.node.name + " - Org: " + currentRepo.node.owner.login + " - Issue Count: " + currentRepo.node.issues.totalCount)

        if (currentRepo.node.issues.totalCount > 0){
            // Get all issues one repo at a time (not ideal)
            getIssuesPagination(client, null, issues_increment, currentRepo.node.owner.login, currentRepo.node.name);

        }
        lastCursor = currentRepo.cursor
        break;
    }
    return lastCursor;
}

const getRepoPagination = (client, cursor, increment) => {
    console.log('Loading Repositories from cursor: ' + cursor)
    client.query({
        query: GET_GH_REPOSITORIES,
        variables: {repo_cursor: cursor, increment: increment}
    }).then(data => {
        lastCursor = loadRepositories(data, client);
        queryIncrement = calculateQueryIncrement(gh_repositories, data.data.viewer.repositories.totalCount)
        if (queryIncrement > 0) {
            getRepoPagination(client, lastCursor, queryIncrement);
        }
        console.log('Last Cursor: ' + lastCursor);
    });
}

const initialLoad = (client) => {
    getRepoPagination(client, null, 10);
//    console.log('initialLoad - Organizations Loaded: ' + gh_organizations.find({}).count());
    console.log('initialLoad - Repositories Loaded: ' + gh_repositories.find({}).count());
}

export const GhLoad = initialLoad;
