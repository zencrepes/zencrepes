import React, { Component } from 'react';

import GET_GITHUB_REPOS from '../../graphql/getRepos.graphql';
export const cfgSources = new Mongo.Collection('cfgSources', {connection: null});
export const localCfgSources = new PersistentMinimongo2(cfgSources, 'github-agile-view');

import calculateQueryIncrement from './calculateQueryIncrement.js';
//import {cfgSources} from "./Sources";

class Repositories {
    constructor(props) {
        this.client = props.client;
        this.currentRepos = [];
        this.updateChip = props.updateChip;
        this.incrementTotalIssues = props.incrementTotalIssues;
        this.updateTotalLoading = props.updateTotalLoading;
    }

    loadRepositories = (data, OrgObj) => {
        let lastCursor = null;
        for (let [key, currentRepo] of Object.entries(data.data.viewer.organization.repositories.edges)){
            //console.log('Inserting: ' + currentRepo.node.name);
            let existNode = cfgSources.findOne({id: currentRepo.node.id});
            let nodeActive = false;
            if (existNode !== undefined) {
                nodeActive = cfgSources.findOne({id: currentRepo.node.id}).active;
            }
            let repoObj = {
                id: currentRepo.node.id,
                name: currentRepo.node.name,
                url: currentRepo.node.url,
                issues_count: currentRepo.node.issues.totalCount,
                org: OrgObj,
                active: nodeActive,
            }
            cfgSources.upsert({
                id: repoObj.id
            }, {
                $set: repoObj
            });
            /*
            this.currentRepos.push({
                id: currentRepo.node.id,
                name: currentRepo.node.name,
                url: currentRepo.node.url,
                issues_count: currentRepo.node.issues.totalCount,
                org: OrgObj,
                cfg_active: false,
            });*/
            this.incrementTotalIssues(currentRepo.node.issues.totalCount);
            //console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name);
            lastCursor = currentRepo.cursor
        }
        return lastCursor;
    }

    getReposPagination = async (cursor, increment, OrgObj) => {
        //console.log('---')
        let data = await this.client.query({
            query: GET_GITHUB_REPOS,
            variables: {repo_cursor: cursor, increment: increment, org_name: OrgObj.login}
        });
        this.updateChip(data.data.rateLimit);
        lastCursor = await this.loadRepositories(data, OrgObj);
        //console.log('ORG OBJ: ' + OrgObj.id);
        queryIncrement = calculateQueryIncrement(cfgSources.find({'org.id': OrgObj.id}).count(), data.data.viewer.organization.repositories.totalCount);
        //console.log(cfgSources.find({'org.id': OrgObj.id}).fetch());
        //console.log('Current count: ' + cfgSources.find({'org.id': OrgObj.id}).count());
        //console.log('Total count: ' + data.data.viewer.organization.repositories.totalCount);
        //console.log('Query increment: ' + queryIncrement);
        if (queryIncrement > 0) {
            await this.getReposPagination(lastCursor, queryIncrement, OrgObj);
        }
    }

    load = async (OrgObj) => {
        this.currentRepos = [];
        //console.log('Loading repos for: ' + OrgObj.login);
        await this.getReposPagination(null, 5, OrgObj);
        return this.currentRepos;
    }

}

export default Repositories;

