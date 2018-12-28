import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import Promise from 'bluebird';

import GET_GITHUB_REPOS from '../../graphql/getRepos.graphql';
import GET_GITHUB_ORGS from '../../graphql/getOrgs.graphql';
import GET_GITHUB_USER_REPOS from '../../graphql/getUserRepos.graphql';

import { cfgSources } from './Minimongo.js';

import calculateQueryIncrement from './calculateQueryIncrement.js';

/*
Load data about GitHub Orgs
 */
class FetchOrgs extends Component {
    constructor (props) {
        super(props);
        this.githubOrgs = [];
        this.totalReposCount = 0;
        this.orgReposCount = {};
        this.state = {};
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('Repos - Initiating load');
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.resetCounts();     // Reset all counts since those will be refresh by loadIssues
            this.load();            // Logic to load Issues
        }
    }

    resetCounts = () => {
        const { setLoadedOrgs, setLoadedRepos, setLoadSuccess} = this.props;
        this.githubOrgs = [];
        setLoadedOrgs(0);
        setLoadedRepos(0);
        setLoadSuccess(false);
        this.totalReposCount = 0;
    };

    load = async () => {
        const { setLoading, setLoadSuccess, login } = this.props;

        setLoading(true);  // Set setLoading to true to indicate repositories are actually loading.
        console.log('Initiate Organizations load');
        await this.getOrgsPagination(null, 10);
        console.log('Oranization loaded: ' + this.githubOrgs.length);


        console.log('Initiate Organizations Repositories load');
        await Promise.map(this.githubOrgs, async (OrgObj): Promise<number> => {
            if (OrgObj !== null) {
                console.log('Loading Org');
                console.log(OrgObj);
                await this.getReposPagination(null, 5, OrgObj, 'org');
            }
        });
        console.log('Organizations Repositories loaded: ' + this.totalReposCount);

        console.log('Initiate Users own Repositories load');
        await this.getReposPagination(null, 20, {login: login}, 'user');
        console.log('Organizations Repositories loaded: ' + this.totalReposCount);

        // Remove archived repositories, we don't want to take care of those since no actions are allowed
        cfgSources.remove({'isArchived':true});

        setLoading(false);
        if (this.totalReposCount > 0) {
            setLoadSuccess(true);
        }
    };

    getOrgsPagination = async (cursor, increment) => {
        const { client, updateChip } = this.props;
        let data = await client.query({
            query: GET_GITHUB_ORGS,
            variables: {repo_cursor: cursor, increment: increment},
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
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
        for (var currentOrg of data.data.viewer.organizations.edges) {
            this.githubOrgs.push(currentOrg.node);
            lastCursor = currentOrg.cursor;
        }
        setIncrementLoadedOrgs(Object.entries(data.data.viewer.organizations.edges).length);
        return lastCursor;
    };

    //TODO - Redo with some better logic and no mutations!
    getReposPagination = async (cursor, increment, OrgObj, type) => {
        const { client, updateChip } = this.props;
        if (OrgObj !== null) {
            let data = {};
            let repositories = {};
            console.log(OrgObj);
            if (type === 'org') {
                data = await client.query({
                    query: GET_GITHUB_REPOS,
                    variables: {repo_cursor: cursor, increment: increment, org_name: OrgObj.login},
                    fetchPolicy: 'no-cache',
                });
                repositories = data.data.viewer.organization.repositories;
            } else {
                data = await client.query({
                    query: GET_GITHUB_USER_REPOS,
                    variables: {repo_cursor: cursor, increment: increment, login: OrgObj.login},
                    fetchPolicy: 'no-cache',
                });
                OrgObj = data.data.user;
                repositories = data.data.viewer.repositories;
            }
            if (this.orgReposCount[OrgObj.id] === undefined) {this.orgReposCount[OrgObj.id] = 0;}
            updateChip(data.data.rateLimit);
            let lastCursor = await this.loadRepositories(repositories, OrgObj);
            console.log('ORG OBJ: ' + OrgObj.id);
            let queryIncrement = calculateQueryIncrement(this.orgReposCount[OrgObj.id], repositories.totalCount);
            console.log(cfgSources.find({'org.id': OrgObj.id}).fetch());
            console.log('Current count: ' + this.orgReposCount[OrgObj.id]);
            console.log('Total count: ' + repositories.totalCount);
            console.log('Query increment: ' + queryIncrement);
            if (queryIncrement > 0) {
                await this.getReposPagination(lastCursor, queryIncrement, OrgObj, type);
            }
        }
    };

    loadRepositories = async (repositories, OrgObj) => {
        const { setIncrementLoadedRepos } = this.props;

        let lastCursor = null;
        for (var currentRepo of repositories.edges) {
            console.log('Inserting: ' + currentRepo.node.name);
            let existNode = cfgSources.findOne({id: currentRepo.node.id});
            let nodeActive = false;
            if (existNode !== undefined) {
                nodeActive = cfgSources.findOne({id: currentRepo.node.id}).active;
            }
            let repoObj = JSON.parse(JSON.stringify(currentRepo.node)); //TODO - Replace this with something better to copy object ?
            repoObj['org'] = OrgObj;
            repoObj['active'] = nodeActive;

            await cfgSources.upsert({
                id: repoObj.id
            }, {
                $set: repoObj
            });
            lastCursor = currentRepo.cursor
        }
        setIncrementLoadedRepos(Object.entries(repositories.edges).length);
        this.orgReposCount[OrgObj.id] = this.orgReposCount[OrgObj.id] + Object.entries(repositories.edges).length;
        this.totalReposCount = this.totalReposCount + Object.entries(repositories.edges).length;
        return lastCursor;
    };

    render() {
        return null;
    }
}

FetchOrgs.propTypes = {
    login: PropTypes.string,
    loading: PropTypes.bool,
    loadFlag: PropTypes.bool,

    setLoadFlag: PropTypes.func,
    setLoading: PropTypes.func,
    setLoadError: PropTypes.func,
    setLoadSuccess: PropTypes.func,
    updateChip: PropTypes.func,

    setLoadedOrgs: PropTypes.func,
    setLoadedRepos: PropTypes.func,
    setIncrementLoadedOrgs: PropTypes.func,
    setIncrementLoadedRepos: PropTypes.func,
};

const mapState = state => ({
    login: state.githubFetchOrgs.login,

    loading: state.githubFetchOrgs.loading,
    loadFlag: state.githubFetchOrgs.loadFlag,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgs.setLoadFlag,
    setLoading: dispatch.githubFetchOrgs.setLoading,
    setLoadError: dispatch.githubFetchOrgs.setLoadError,
    setLoadSuccess: dispatch.githubFetchOrgs.setLoadSuccess,
    setLoadedOrgs: dispatch.githubFetchOrgs.setLoadedOrgs,
    setLoadedRepos: dispatch.githubFetchOrgs.setLoadedRepos,
    setIncrementLoadedOrgs: dispatch.githubFetchOrgs.setIncrementLoadedOrgs,
    setIncrementLoadedRepos: dispatch.githubFetchOrgs.setIncrementLoadedRepos,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(FetchOrgs));
