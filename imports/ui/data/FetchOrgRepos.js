import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import Promise from 'bluebird';

import GET_GITHUB_REPOS from '../../graphql/getReposExternal.graphql';

import { cfgSources } from './Minimongo.js';

import calculateQueryIncrement from './calculateQueryIncrement.js';

/*
Load data about Github Orgs
 */
class FetchOrgRepos extends Component {
    constructor (props) {
        super(props);
        this.reposCount = 0;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('ScanOrg - Initiating load');
            setLoadFlag(false); // Right away set loadRepositories to false
            this.load();           // Logic to load Issues
        }
    };

    load = async () => {
        const { setLoading, name, setLoadSuccess, setAvailableRepos, setLoadedRepos} = this.props;

        setLoading(true);  // Set loading to true to indicate content is actually loading.
        setAvailableRepos(0);
        setLoadedRepos(0);
        setLoadSuccess(false);
        this.reposCount = 0;
        console.log('Getting repositories from Organization: ' + name);
        await this.getReposPagination(null, 10);
        setLoading(false);
    };

    getReposPagination = async (cursor, increment) => {
        const { client, updateChip, name, setLoadError, setLoadSuccess, setAvailableRepos } = this.props;

        let data = await client.query({
            query: GET_GITHUB_REPOS,
            variables: {repo_cursor: cursor, increment: increment, org_name: name},
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        });
        console.log(data);
        updateChip(data.data.rateLimit);
        if (data.data.organization !== null) {
            setLoadError(false);
            setLoadSuccess(true);
            setAvailableRepos(data.data.organization.repositories.totalCount);
            let lastCursor = await this.loadRepositories(data);
            let queryIncrement = calculateQueryIncrement(this.reposCount, data.data.organization.repositories.totalCount);
            console.log(cfgSources.find({'org.id': data.data.organization.id}));
            console.log('Current count: ' + this.reposCount);
            console.log('Total count: ' + data.data.organization.repositories.totalCount);
            console.log('Query increment: ' + queryIncrement);
            if (queryIncrement > 0) {
                await this.getReposPagination(lastCursor, queryIncrement);
            }
        } else {
            setLoadError(true);
        }
    };

    loadRepositories = async (data) => {
        const { incrementLoadedRepos } = this.props;
        let lastCursor = null;
        for (let [key, currentRepo] of Object.entries(data.data.organization.repositories.edges)) {
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
                org: {
                    login: data.data.organization.login,
                    name: data.data.organization.name,
                    id: data.data.organization.id,
                    url: data.data.organization.url,
                },
                active: nodeActive,
            };
            await cfgSources.upsert({
                id: repoObj.id
            }, {
                $set: repoObj
            });
            lastCursor = currentRepo.cursor
        }
        this.reposCount = this.reposCount + Object.entries(data.data.organization.repositories.edges).length;
        incrementLoadedRepos(Object.entries(data.data.organization.repositories.edges).length);
        return lastCursor;
    };

    render() {
        return null;
    }
}

FetchOrgRepos.propTypes = {

};

const mapState = state => ({
    loadFlag: state.githubFetchOrgRepos.loadFlag,
    loading: state.githubFetchOrgRepos.loading,

    name: state.githubFetchOrgRepos.name,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgRepos.setLoadFlag,
    setLoading: dispatch.githubFetchOrgRepos.setLoading,
    setLoadError: dispatch.githubFetchOrgRepos.setLoadError,
    setLoadSuccess: dispatch.githubFetchOrgRepos.setLoadSuccess,

    setAvailableRepos: dispatch.githubFetchOrgRepos.setAvailableRepos,
    setLoadedRepos: dispatch.githubFetchOrgRepos.setLoadedRepos,
    incrementLoadedRepos: dispatch.githubFetchOrgRepos.incrementLoadedRepos,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(FetchOrgRepos));
