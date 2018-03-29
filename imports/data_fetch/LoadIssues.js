import React, { Component } from 'react';

import GET_GH_ISSUES from '../graphql/getIssues.graphql';
export const gh_issues = new Mongo.Collection('gh_issues', {connection: null});
export const local_gh_issues = new PersistentMinimongo2(gh_issues, 'git-pmview');
export const gh_milestones = new Mongo.Collection('gh_milestones', {connection: null});
export const local_gh_milestones = new PersistentMinimongo2(gh_milestones, 'git-pmview');

import calculateQueryIncrement from './utils/calculateQueryIncrement.js';

const loadIssues = (data) => {
    lastCursor = null;
    for (let [key, currentIssue] of Object.entries(data.data.viewer.organization.repository.issues.edges)){
        gh_issues.insert({
            _id: currentIssue.node.id,
            title: currentIssue.node.title,
            url: currentIssue.node.url,
            author: currentIssue.node.author,
            org: {'login': data.data.viewer.organization.login, 'id': data.data.viewer.organization.id, 'name': data.data.viewer.organization.name, 'url': data.data.viewer.organization.url},
            repo: {'name': data.data.viewer.organization.repository.name, 'id': data.data.viewer.organization.repository.id, 'url': data.data.viewer.organization.repository.url},
            labels: currentIssue.node.labels.edges,
            repo_id: data.data.viewer.organization.repository.id,
            state: currentIssue.node.state,
            milestone: currentIssue.node.milestone,
            assignees: currentIssue.node.assignees,
            createdAt: currentIssue.node.createdAt,
            updatedAt: currentIssue.node.updatedAt,
            closedAt: currentIssue.node.closedAt,
        });
        if (currentIssue.node.milestone !== null) {
            gh_milestones.update({
                id: currentIssue.node.milestone.id
            }, {
                $set: currentIssue.node.milestone
            }, {
                upsert: true
            })
        }
        console.log('LoadIsues: Added: ' + data.data.viewer.organization.login + " / " + data.data.viewer.organization.repository.name + " / " + currentIssue.node.title);
        lastCursor = currentIssue.cursor
    }
    return lastCursor;
}


/* Get Github organizations with pagination */
const getIssuesPagination = (client, cursor, increment, org_name, repo_name) => {
    client.query({
        query: GET_GH_ISSUES,
        variables: {repo_cursor: cursor, increment: increment, org_name: org_name, repo_name: repo_name}
    }).then(data => {
        lastCursor = loadIssues(data);
        queryIncrement = calculateQueryIncrement(gh_issues.find({ repo_id: data.data.viewer.organization.repository.id }).count(), data.data.viewer.organization.repository.issues.totalCount)
        if (queryIncrement > 0) {
            getIssuesPagination(client, lastCursor, queryIncrement, org_name, repo_name);
        }
    });
}

const initialLoad = (client, org_name, repo_name) => {
    console.log('LoadRepos: Starting to load all Repositories for Github Org: ' + org_name)
    getIssuesPagination(client, null, 5, org_name, repo_name);
}

export const LoadIssues = initialLoad;
