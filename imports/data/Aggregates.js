import React, { Component } from 'react';
import { gh_issues } from '../data_fetch/LoadIssues.js'
import { connect } from "react-redux";
import {withHighcharts} from "react-jsx-highstock";

let authors = {}
let assignees = {}
let states = {}
let organizations = {}
let repositories = {}
let milestones = {}
let milestones_states = {}
let labels = {}

// Build labels aggregate
const buildLabelsAggregate = (issue) => {
    if (!issue.hasOwnProperty('labels')) {
        idx = 'unassigned';
        var label = {name: 'empty', 'description': 'No labels assigned'};
        if (labels[idx] === undefined) {
            labels[idx] = Object.assign({}, label, {issuesCount: 1});
        } else {
            labels[idx]['issuesCount'] = labels[idx]['issuesCount'] + 1;
        }
    } else {
        issue.labels.map((current_label) => {
            if (labels[current_label.node.name] === undefined) {
                labels[current_label.node.name] = Object.assign({}, current_label.node, {issuesCount: 1});
            } else {
                labels[current_label.node.name]['issuesCount'] = labels[current_label.node.name]['issuesCount'] + 1;
            }
        });
    }
}

// Build authors aggregate
const buildAuthorsAggregate = (issue) => {
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

// Build milestones aggregate
const buildMilestonesAggregate = (issue) => {
    if (issue.milestone === null) {
        idx = 'unassigned';
        milestone = {'title': 'unassigned', 'url': null};
    } else {
        idx = issue.milestone.id;
        milestone = issue.milestone;
    }
    if (milestones[idx] === undefined) {
        milestones[idx] = Object.assign({}, milestone, {issuesCount: 1});
    } else {
        milestones[idx]['issuesCount'] = milestones[idx]['issuesCount'] + 1;
    }
}

// Build State aggregate
const buildStateAggregate = (issue) => {
    if (states[issue.state] === undefined) {
        states[issue.state] = {'issuesCount': 1, 'name': issue.state}
    } else {
        states[issue.state]['issuesCount'] = states[issue.state]['issuesCount'] + 1;
    }
}

// Build Organization aggregate
const buildOrganizationAggregate = (issue) => {
    if (organizations[issue.org.login] === undefined) {
        organizations[issue.org.login] = Object.assign({}, issue.org, {issuesCount: 1});
    } else {
        organizations[issue.org.login]['issuesCount'] = organizations[issue.org.login]['issuesCount'] + 1;
    }
}

// Build Repositories aggregate
const buildRepositoriesAggregate = (issue) => {
    if (repositories[issue.repo.name] === undefined) {
        repositories[issue.repo.name] = Object.assign({}, issue.repo, {issuesCount: 1});
    } else {
        repositories[issue.repo.name]['issuesCount'] = repositories[issue.repo.name]['issuesCount'] + 1;
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
const Aggregates = (globlaState) => {
    gh_issues.find({}).forEach((issue) => {
        buildAuthorsAggregate(issue);
        buildAssigneesAggregate(issue);
        buildStateAggregate(issue);
        buildOrganizationAggregate(issue);
        buildRepositoriesAggregate(issue);
        buildMilestonesAggregate(issue);
        buildLabelsAggregate(issue);
    });

    for (let [key, milestone] of Object.entries(milestones)){
        if (milestones_states[milestone.state] === undefined) {
            milestones_states[milestone.state] = {'issuesCount': 1, 'name': milestone.state};
        } else {
            milestones_states[milestone.state]['issuesCount'] = milestones_states[milestone.state]['issuesCount'] + 1;
        }
    }

    console.log(globlaState);

    console.log("Authors");
    console.log(authors);
    console.log('---');
    console.log("Assignees");
    console.log(assignees);
    console.log("States");
    console.log(states);
    console.log("Organizations");
    console.log(organizations);
    console.log("Repositories");
    console.log(repositories);
    console.log("Milestones");
    console.log(milestones);
    console.log("Milestones States");
    console.log(milestones_states);
    console.log("Labels");
    console.log(labels);
}

export default Aggregates;

