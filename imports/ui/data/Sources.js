import React, { Component } from 'react';

import GET_GITHUB_ORGS from '../../graphql/getOrgs.graphql';

import { localCfgSources } from './Repositories.js';

//export const cfgSources = new Mongo.Collection('cfgSources', {connection: null});
//export const localCfgSource = new PersistentMinimongo2(cfgSource, 'github-agile-view');

import Repositories from './Repositories.js';

import calculateQueryIncrement from './calculateQueryIncrement.js';
import {cfgSources} from "./Repositories";

class Sources {
    constructor(props) {
        this.client = props.client;
        this.updateChip = props.updateChip;
        this.incrementTotalOrgs = props.incrementTotalOrgs;
        this.incrementTotalRepos = props.incrementTotalRepos;
        this.updateTotalLoading = props.updateTotalLoading;
        this.setTotalRepos = props.setTotalRepos;
        this.setTotalIssues = props.setTotalIssues;
        this.setTotalOrgs = props.setTotalOrgs;
        this.repos = new Repositories(props);
        this.orgCount = 0;
    }

    loadOrganizations = async (data) => {
        let lastCursor = null;
        this.incrementTotalOrgs(Object.entries(data.data.viewer.organizations.edges).length);
        for (let [key, currentOrg] of Object.entries(data.data.viewer.organizations.edges)){
            this.incrementTotalRepos(currentOrg.node.repositories.totalCount);
            this.orgCount = this.orgCount + 1;
            await this.repos.load(currentOrg.node)
            lastCursor = currentOrg.cursor;
        }
        return lastCursor;
    }

    getOrgsPagination = async (cursor, increment) => {
        let data = await this.client.query({
            query: GET_GITHUB_ORGS,
            variables: {repo_cursor: cursor, increment: increment}
        })
        this.updateChip(data.data.rateLimit);
        lastCursor = await this.loadOrganizations(data);
        queryIncrement = calculateQueryIncrement(this.orgCount, data.data.viewer.organizations.totalCount);
        if (queryIncrement > 0) {
            await this.getOrgsPagination(lastCursor, queryIncrement);
        }
    }

    load = async () => {
        this.updateTotalLoading(true);
        //console.log(localCfgSources);
        this.setTotalRepos(0);
        this.setTotalIssues(0);
        this.setTotalOrgs(0);
        //await localCfgSources.refresh();
        await this.getOrgsPagination(null, 10);
        this.updateTotalLoading(false);
    }

}

export default Sources;


