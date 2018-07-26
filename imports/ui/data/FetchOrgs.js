import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import Promise from 'bluebird';

import GET_GITHUB_REPOS from '../../graphql/getRepos.graphql';
import GET_GITHUB_ORGS from '../../graphql/getOrgs.graphql';

import { cfgSources } from './Minimongo.js';

import calculateQueryIncrement from './calculateQueryIncrement.js';

/*
Load data about Github Orgs
 */
class FetchOrgs extends Component {
    constructor (props) {
        super(props);
        this.githubOrgs = [];
        this.state = {};
    }

    componentDidMount() {
        console.log('FectchIssues - Initialized');
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('Repos - Initiating load');
            setLoadFlag(false); // Right away set loadRepositories to false
            this.resetCounts();         // Reset all counts since those will be refresh by loadIssues
            this.load();           // Logic to load Issues
        }
    };

    resetCounts = () => {
        const { setLoadedOrgs, setLoadedRepos} = this.props;
        this.githubOrgs = [];
        setLoadedOrgs(0);
        setLoadedRepos(0);
    };

    load = async () => {
        const { setLoading } = this.props;

        setLoading(true);  // Set setLoading to true to indicate repositories are actually loading.

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

        setLoading(false);
    };

    getOrgsPagination = async (cursor, increment) => {
        const { client, updateChip } = this.props;
        let data = await client.query({
            query: GET_GITHUB_ORGS,
            variables: {repo_cursor: cursor, increment: increment},
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore,'
        });
        console.log(data);
        updateChip(data.data.rateLimit);
        let lastCursor = await this.loadOrganizations(data);
        let queryIncrement = calculateQueryIncrement(this.githubOrgs.length, data.data.viewer.organizations.totalCount);
        if (queryIncrement > 0) {
            await this.getOrgsPagination(lastCursor, queryIncrement);
        }
    };

    loadOrganizations = async (data) => {
        const { setIncrementLoadedOrgs } = this.props;

        let lastCursor = null;
        for (let [key, currentOrg] of Object.entries(data.data.viewer.organizations.edges)){
            this.githubOrgs.push(currentOrg.node);
            lastCursor = currentOrg.cursor;
        }
        setIncrementLoadedOrgs(Object.entries(data.data.viewer.organizations.edges).length);
        return lastCursor;
    };

    getReposPagination = async (cursor, increment, OrgObj) => {
        const { client, updateChip } = this.props;

        if (OrgObj !== null) {
            let data = await client.query({
                query: GET_GITHUB_REPOS,
                variables: {repo_cursor: cursor, increment: increment, org_name: OrgObj.login},
                fetchPolicy: 'no-cache',
            });
            updateChip(data.data.rateLimit);
            let lastCursor = await this.loadRepositories(data, OrgObj);
            console.log('ORG OBJ: ' + OrgObj.id);
            let queryIncrement = calculateQueryIncrement(cfgSources.find({'org.id': OrgObj.id}).count(), data.data.viewer.organization.repositories.totalCount);
            console.log(cfgSources.find({'org.id': OrgObj.id}).fetch());
            console.log('Current count: ' + cfgSources.find({'org.id': OrgObj.id}).count());
            console.log('Total count: ' + data.data.viewer.organization.repositories.totalCount);
            console.log('Query increment: ' + queryIncrement);
            if (queryIncrement > 0) {
                await this.getReposPagination(lastCursor, queryIncrement, OrgObj);
            }
        }
    };

    loadRepositories = async (data, OrgObj) => {
        const { setIncrementLoadedRepos } = this.props;

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
        setIncrementLoadedRepos(Object.entries(data.data.viewer.organization.repositories.edges).length);
        return lastCursor;
    }

    render() {
        return null;
    }
}

FetchOrgs.propTypes = {

};

const mapState = state => ({
    loading: state.githubFetchOrgs.loading,
    loadFlag: state.githubFetchOrgs.loadFlag,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgs.setLoadFlag,
    setLoading: dispatch.githubFetchOrgs.setLoading,
    setLoadedOrgs: dispatch.githubFetchOrgs.setLoadedOrgs,
    setLoadedRepos: dispatch.githubFetchOrgs.setLoadedRepos,
    setIncrementLoadedOrgs: dispatch.githubFetchOrgs.setIncrementLoadedOrgs,
    setIncrementLoadedRepos: dispatch.githubFetchOrgs.setIncrementLoadedRepos,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(FetchOrgs));
