import React, { Component } from 'react';

import GET_GITHUB_REPOS from '../../graphql/getRepos.graphql';
export const cfgRepositories = new Mongo.Collection('cfgRepositories', {connection: null});
//export const localCfgRepositories = new PersistentMinimongo2(cfgSource, 'github-agile-view');

import calculateQueryIncrement from './calculateQueryIncrement.js';

class Repositories {
    constructor(props) {
        this.client = props.client;
        this.currentRepos = [];
        this.updateChip = props.updateChip;
        this.incrementTotalIssues = props.incrementTotalIssues;
        this.updateTotalLoading = props.updateTotalLoading;
    }

    loadRepositories = (data) => {
        let lastCursor = null;
        for (let [key, currentRepo] of Object.entries(data.data.viewer.organization.repositories.edges)){
            this.currentRepos.push({
                id: currentRepo.node.id,
                name: currentRepo.node.name,
                url: currentRepo.node.url,
                issues_count: currentRepo.node.issues.totalCount,
                org_login: data.data.viewer.organization.login,
                cfg_use: false,
            });
            this.incrementTotalIssues(currentRepo.node.issues.totalCount);
            //console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name);
            lastCursor = currentRepo.cursor
        }
        return lastCursor;
    }

    getReposPagination = async (cursor, increment, OrgLogin) => {
        let data = await this.client.query({
            query: GET_GITHUB_REPOS,
            variables: {repo_cursor: cursor, increment: increment, org_name: OrgLogin}
        });
        this.updateChip(data.data.rateLimit);
        lastCursor = await this.loadRepositories(data);
        queryIncrement = calculateQueryIncrement(this.currentRepos.length, data.data.viewer.organization.repositories.totalCount);
        if (queryIncrement > 0) {
            await this.getReposPagination(lastCursor, queryIncrement, OrgLogin);
        }
    }

    load = async (OrgLogin, RepoCount) => {
        this.currentRepos = [];
        await this.getReposPagination(null, 5, OrgLogin);
        return this.currentRepos;
    }

}

export default Repositories;

