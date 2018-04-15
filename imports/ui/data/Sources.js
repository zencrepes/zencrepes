import React, { Component } from 'react';

import GET_GITHUB_ORGS from '../../graphql/getOrgs.graphql';
export const cfgSources = new Mongo.Collection('cfgSources', {connection: null});
//export const localCfgSource = new PersistentMinimongo2(cfgSource, 'github-agile-view');

import Repositories from './Repositories.js';

import calculateQueryIncrement from './calculateQueryIncrement.js';

class Sources {
    constructor(props) {
        this.client = props.client;
        this.updateChip = props.updateChip;
        this.incrementTotalOrgs = props.incrementTotalOrgs;
        this.repos = new Repositories(props);
    }

    loadOrganizations = (data) => {
        let lastCursor = null;
        this.incrementTotalOrgs(Object.entries(data.data.viewer.organizations.edges).length);
        for (let [key, currentOrg] of Object.entries(data.data.viewer.organizations.edges)){
            cfgSources.insert({
                _id: currentOrg.node.id,
                name: currentOrg.node.name,
                login: currentOrg.node.login,
                url: currentOrg.node.url,
                repo_count: currentOrg.node.repositories.totalCount,
                cfg_use: false,
                repos: this.repos.load(currentOrg.node.login),
            });
            lastCursor = currentOrg.cursor
        }
        return lastCursor;
    }

    getOrgsPagination = (cursor, increment) => {
        this.client.query({
            query: GET_GITHUB_ORGS,
            variables: {repo_cursor: cursor, increment: increment}
        }).then(data => {
            this.updateChip(data.data.rateLimit);
            lastCursor = this.loadOrganizations(data);
            queryIncrement = calculateQueryIncrement(cfgSources.find({}).count(), data.data.viewer.organizations.totalCount)
            if (queryIncrement > 0) {
                this.getOrgsPagination(lastCursor, queryIncrement);
            }
        });
    }

    load() {
        this.getOrgsPagination(null, 10);
    }

}

export default Sources;


