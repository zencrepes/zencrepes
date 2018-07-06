import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import Promise from 'bluebird';

import GET_GITHUB_REPOS from '../../graphql/getRepos.graphql';
import GET_GITHUB_ORGS from '../../graphql/getOrgs.graphql';

export const cfgSources = new Mongo.Collection('cfgSources', {connection: null});
export const localCfgSources = new PersistentMinimongo2(cfgSources, 'GAV-Repos');
window.repos = cfgSources;

import calculateQueryIncrement from './calculateQueryIncrement.js';

/*
Load data about Github Orgs
 */
class Orgs extends Component {
    constructor (props) {
        super(props);
        this.githubOrgs = [];
        this.state = {};
    }

    componentDidMount() {
        console.log('FectchIssues - Initialized');
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setReposLoadFlag, reposLoadFlag } = this.props;
        if (reposLoadFlag) {
            console.log('Repos - Initiating load');
            setReposLoadFlag(false); // Right away set loadRepositories to false
            this.resetCounts();         // Reset all counts since those will be refresh by loadIssues
            this.load();           // Logic to load Issues
        }
    }

    resetCounts = () => {
        const { setLoadedOrgs, setLoadedRepos} = this.props;
        this.githubOrgs = [];
        setLoadedOrgs(0);
        setLoadedRepos(0);
    };

    load = async () => {
        const { setReposLoadingFlag } = this.props;

        setReposLoadingFlag(true);  // Set setReposLoadingFlag to true to indicate repositories are actually loading.

        console.log('Initiate Organizations load');
        await this.getOrgsPagination(null, 10);
        console.log('Oranization loaded: ' + this.githubOrgs.length);


        console.log('Initiate Repositories load');
        await Promise.map(this.githubOrgs, async (orgObj): Promise<number> => {
            console.log('Loading Org');
            console.log(orgObj);
            await this.getReposPagination(null, 5, orgObj);
        });
        console.log('Repositories loaded: ' + cfgSources.find({}).count());

        setReposLoadingFlag(false);
    };

    getOrgsPagination = async (cursor, increment) => {
        const { client, updateChip } = this.props;
        let data = await client.query({
            query: GET_GITHUB_ORGS,
            variables: {repo_cursor: cursor, increment: increment},
            fetchPolicy: 'no-cache',
        })
        updateChip(data.data.rateLimit);
        lastCursor = await this.loadOrganizations(data);
        queryIncrement = calculateQueryIncrement(this.githubOrgs.length, data.data.viewer.organizations.totalCount);
        if (queryIncrement > 0) {
            await this.getOrgsPagination(lastCursor, queryIncrement);
        }
    };

    loadOrganizations = async (data) => {
        let lastCursor = null;
        for (let [key, currentOrg] of Object.entries(data.data.viewer.organizations.edges)){
            this.githubOrgs.push(currentOrg.node);
            lastCursor = currentOrg.cursor;
        }
        return lastCursor;
    };

    getReposPagination = async (cursor, increment, OrgObj) => {
        const { client, updateChip } = this.props;

        //console.log('---')
        let data = await client.query({
            query: GET_GITHUB_REPOS,
            variables: {repo_cursor: cursor, increment: increment, org_name: OrgObj.login},
            fetchPolicy: 'no-cache',
        });
        updateChip(data.data.rateLimit);
        lastCursor = await this.loadRepositories(data, OrgObj);
        console.log('ORG OBJ: ' + OrgObj.id);
        queryIncrement = calculateQueryIncrement(cfgSources.find({'org.id': OrgObj.id}).count(), data.data.viewer.organization.repositories.totalCount);
        console.log(cfgSources.find({'org.id': OrgObj.id}).fetch());
        console.log('Current count: ' + cfgSources.find({'org.id': OrgObj.id}).count());
        console.log('Total count: ' + data.data.viewer.organization.repositories.totalCount);
        console.log('Query increment: ' + queryIncrement);
        if (queryIncrement > 0) {
            await this.getReposPagination(lastCursor, queryIncrement, OrgObj);
        }
    };

    loadRepositories = async (data, OrgObj) => {
        let lastCursor = null;
        for (let [key, currentRepo] of Object.entries(data.data.viewer.organization.repositories.edges)){
            console.log('Inserting: ' + currentRepo.node.name);
            let existNode = cfgSources.findOne({id: currentRepo.node.id});
            let nodeActive = false;
            if (existNode !== undefined) {
                nodeActive = cfgSources.findOne({id: currentRepo.node.id}).active;
            }
            let repoObj = {
                id: currentRepo.node.id,
                name: currentRepo.node.name,
                url: currentRepo.node.url,
                issues_count: currentRepo.node.issues.totalCount, // TODO - OUTDATED
                issues: currentRepo.node.issues,
                labels: currentRepo.node.labels,
                databaseId: currentRepo.node.databaseId,
                org: OrgObj,
                active: nodeActive,
            };
            await cfgSources.upsert({
                id: repoObj.id
            }, {
                $set: repoObj
            });
            lastCursor = currentRepo.cursor
        }
        return lastCursor;
    }

    render() {
        return null;
    }
}

Orgs.propTypes = {

};

const mapState = state => ({
    reposLoadingFlag: state.githubRepos.reposLoadingFlag,
    reposLoadFlag: state.githubRepos.reposLoadFlag,

});

const mapDispatch = dispatch => ({
    setReposLoadFlag: dispatch.githubRepos.setReposLoadFlag,
    setReposLoadingFlag: dispatch.githubRepos.setReposLoadingFlag,
    setLoadedOrgs: dispatch.githubRepos.setLoadedOrgs,
    setLoadedRepos: dispatch.githubRepos.setLoadedRepos,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Orgs));
