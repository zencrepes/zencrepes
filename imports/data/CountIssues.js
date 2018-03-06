import React, { Component } from 'react';
import { gh_issues } from '../data_fetch/LoadIssues.js'

export const gh_issues_closed_per_day = new Mongo.Collection('gh_issues_closed_per_day', {connection: null});


const countIssues = () => {
    console.log("Count Issues");
    let firstCreatedIssue = gh_issues.findOne({}, { sort: { createdAt: 'asc' } });
    let lastCreatedIssue = gh_issues.findOne({}, { sort: { createdAt: 'desc' } });

    let firstClosedIssue = gh_issues.findOne({}, { sort: { closedAt: 'asc' } });
    let lastClosedIssue = gh_issues.findOne({}, { sort: { closedAt: 'desc' } });

    let firstUpdatedIssue = gh_issues.findOne({}, { sort: { updatedAt: 'asc' } });
    let lastUpdatedIssue = gh_issues.findOne({}, { sort: { updatedAt: 'desc' } });

    console.log("createdAt - First: " + firstCreatedIssue.title + "(" + firstCreatedIssue.createdAt + ")" + " - Last: " + lastCreatedIssue.title + "(" + lastCreatedIssue.createdAt + ")")
    console.log("closedAt - First: " + firstClosedIssue.title + "(" + firstClosedIssue.createdAt + ")" + " - Last: " + lastClosedIssue.title + "(" + lastClosedIssue.createdAt + ")")
    console.log("updatedAt - First: " + firstUpdatedIssue.title + "(" + firstUpdatedIssue.createdAt + ")" + " - Last: " + lastUpdatedIssue.title + "(" + lastUpdatedIssue.createdAt + ")")

}

export default countIssues;