import React, { Component } from 'react';
import { gh_issues } from '../data_fetch/LoadIssues.js'
import { connect } from "react-redux";
import {withHighcharts} from "react-jsx-highstock";

/*
 author: currentIssue.node.author,
 org: data.data.viewer.organization.login,
 repo: data.data.viewer.organization.repository.name,
 repo_id: data.data.viewer.organization.repository.id,
 state: currentIssue.node.state,
 milestone: currentIssue.node.milestone,
 assignees: currentIssue.node.assignees,
 createdAt: currentIssue.node.createdAt,
 updatedAt: currentIssue.node.updatedAt,
 closedAt: currentIssue.node.closedAt,
 */

let authors = {}
let assignees = {}

// Build authors aggregate
const buildAuthorAggregate = (issue) => {
    if (issue.author === null) {
        idx = 'unassigned';
        author = {login: 'unassigned', 'url': null};
    } else {
        idx = issue.author.login;
        author = issue.author;
    }
    if (authors[idx] === undefined) {
        authors[idx] = Object.assign({}, author, {issuesCount: 1});
    } else {
        authors[idx]['issuesCount'] = authors[idx]['issuesCount'] + 1;
    }
}

const buildAssigneesAggregate = (issue) => {
    if (issue.assignees === null) {
        idx = 'unassigned';
        assignee = {login: 'unassigned', 'url': null};
        if (assignees[idx] === undefined) {
            assignees[idx] = Object.assign({}, assignee, {issuesCount: 1});
        } else {
            assignees[idx]['issuesCount'] = assignees[idx]['issuesCount'] + 1;
        }
    } else {
        issue.assignees.edges.map((assignee) => {
            if (assignees[assignee.node.login] === undefined) {
                assignees[assignee.node.login] = Object.assign({}, assignee.node, {issuesCount: 1});
            } else {
                assignees[assignee.node.login]['issuesCount'] = assignees[assignee.node.login]['issuesCount'] + 1;
            }
        });
    }
}

//Very basic non-optimized initial implementation
const Aggregates = () => {
    gh_issues.find({}).forEach((issue) => {
        buildAuthorAggregate(issue);
        buildAssigneesAggregate(issue);
    });
    console.log(authors);
    console.log('---');
    console.log(assignees);
}

export default Aggregates;

