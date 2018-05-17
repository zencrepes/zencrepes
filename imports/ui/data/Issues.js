import React, { Component } from 'react';

import GET_GITHUB_ISSUES from '../../graphql/getIssues.graphql';
export const cfgIssues = new Mongo.Collection('cfgIssues', {connection: null});
export const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues');

window.issues = cfgIssues;

import {cfgSources} from "./Repositories.js";

import calculateQueryIncrement from './calculateQueryIncrement.js';

//Get various stats around issue timing
function getStats(createdAt, updatedAt, closedAt) {
    //This issue has been opened for X days
    let openedDuring = null;
    if (createdAt !== null && closedAt !== null) {
        openedDuring = Math.round((new Date(closedAt) - new Date(createdAt)) / (1000 * 3600 * 24), 0);
    }

    //This issue was first opened X days ago
    let openedSince = null;
    if (createdAt !== null) {
        openedSince = Math.round((new Date() - new Date(createdAt)) / (1000 * 3600 * 24), 0);
    }
    //This issue was closed X days ago
    let closedSince = null;
    if (closedAt !== null) {
        closedSince = Math.round((new Date() - new Date(closedAt)) / (1000 * 3600 * 24), 0);
    }
    //This issue was last updated X days ago
    let updatedSince = null;
    if (updatedAt !== null) {
        updatedSince = Math.round((new Date() - new Date(updatedAt)) / (1000 * 3600 * 24), 0);
    }
    let stats = {
        openedDuring: openedDuring,
        openedSince: openedSince,
        closedSince: closedSince,
        updatedSince: updatedSince,
    };
    return stats;
}

class Issues {
    constructor(props) {
        this.client = props.client;
        this.currentRepos = [];
        this.updateChip = props.updateChip;
        this.incrementUnfilteredIssues = props.incrementUnfilteredIssues;
        this.updateIssuesLoading = props.updateIssuesLoading;
    }

    loadIssues = async (data) => {
        let lastCursor = null;
        for (let [key, currentIssue] of Object.entries(data.data.viewer.organization.repository.issues.edges)){
            console.log('Loading issue: ' + currentIssue.node.title);
            let existNode = cfgIssues.findOne({id: currentIssue.node.id});

            let nodeFiltered = false;
            if (existNode !== undefined) {
                nodeFiltered = existNode.filtered;
            }
            let issueObj = {
                id: currentIssue.node.id,
                title: currentIssue.node.title,
                url: currentIssue.node.url,
                author: currentIssue.node.author,
                org: {'login': data.data.viewer.organization.login, 'id': data.data.viewer.organization.id, 'name': data.data.viewer.organization.name, 'url': data.data.viewer.organization.url},
                repo: {'name': data.data.viewer.organization.repository.name, 'id': data.data.viewer.organization.repository.id, 'url': data.data.viewer.organization.repository.url},
                labels: currentIssue.node.labels,
                repo_id: data.data.viewer.organization.repository.id,
                state: currentIssue.node.state,
                milestone: currentIssue.node.milestone,
                assignees: currentIssue.node.assignees,
                createdAt: currentIssue.node.createdAt,
                updatedAt: currentIssue.node.updatedAt,
                closedAt: currentIssue.node.closedAt,
                stats: getStats(currentIssue.node.createdAt, currentIssue.node.updatedAt, currentIssue.node.closedAt),
                comments: currentIssue.node.comments,
                participants: currentIssue.node.participants,
                refreshed: true,
            }
            await cfgIssues.upsert({
                id: issueObj.id
            }, {
                $set: issueObj
            });
            await this.incrementUnfilteredIssues(1);
            //console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name);
            lastCursor = currentIssue.cursor
        }
        return lastCursor;
    }

    getIssuesPagination = async (cursor, increment, RepoObj) => {
        console.log('Querying server');
        let data = await this.client.query({
            query: GET_GITHUB_ISSUES,
            variables: {repo_cursor: cursor, increment: increment, org_name: RepoObj.org.login, repo_name: RepoObj.name}
        });
        this.updateChip(data.data.rateLimit);
        lastCursor = await this.loadIssues(data);
        queryIncrement = calculateQueryIncrement(cfgIssues.find({'repo.id': RepoObj.id, 'refreshed': true}).count(), data.data.viewer.organization.repository.issues.totalCount);
        console.log('Loading data for repo:  ' + RepoObj.name + 'Query Increment: ' + queryIncrement);
        if (queryIncrement > 0) {
            await this.getIssuesPagination(lastCursor, queryIncrement, RepoObj);
        }
    }

    load = async () => {
        this.updateIssuesLoading(true);
        //await localCfgIssues.refresh();
        let allRepos = await cfgSources.find({}).fetch();
        for (let repo of allRepos) {
            if (repo.active === false) {
                //If repo is inactive, delete any issues attached to this repo (if any)
                //let attachedIssues = cfgIssues.find({'repo.id': repo.id}).count();
                //console.log('Repo is inactive, removing: ' + attachedIssues + ' attached issues');
                await cfgIssues.remove({'repo.id': repo.id});
            } else {
                //If repo is active, load all issues attached to this repo (if any)
                if (repo.issues_count >= 0) {
                    console.log('Going through repo: ' + repo.name + ' - Is active and has ' + repo.issues_count + ' issues');

                    //First, marked all existing issues are non-refreshed
                    let updatedDocs = cfgIssues.update({'repo.id': repo.id}, {$set: {'refreshed': false}});
                    console.log('Set the refreshed flag to false for: ' + updatedDocs + ' documents');

                    //Load as many issues as possible
                    let queryIncrement = 100;
                    if (repo.issues_count < 100) {
                        queryIncrement = repo.issues_count;
                    }
                    console.log('Query Increment: ' + queryIncrement);
                    await this.getIssuesPagination(null, queryIncrement, repo);
                }
            }

        }
        this.updateIssuesLoading(false);
        console.log('Load completed: ' + cfgIssues.find({}).count() + ' issues loaded');
    }
}

export default Issues;

