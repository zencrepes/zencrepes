import { Component } from 'react'
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_REPOS from '../../graphql/getReposExternal.graphql';

import { cfgSources } from './Minimongo.js';

import calculateQueryIncrement from './calculateQueryIncrement.js';
import PropTypes from "prop-types";

/*
Load data about GitHub Orgs
 */
class FetchOrgRepos extends Component {
    constructor (props) {
        super(props);
        this.reposCount = 0;
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            setLoadFlag(false); // Right away set loadRepositories to false
            this.load();           // Logic to load Issues
        }
    }

    load = async () => {
        const { setLoading, name, setLoadSuccess, setLoadError, setAvailableRepos, setLoadedRepos, log} = this.props;

        setLoading(true);  // Set loading to true to indicate content is actually loading.
        setAvailableRepos(0);
        setLoadedRepos(0);
        setLoadSuccess(false);
        setLoadError(false);
        this.reposCount = 0;
        log.info('Getting repositories from Organization: ' + name);
        await this.getReposPagination(null, 10);
        setLoading(false);

        // Remove archived repositories, we don't want to take care of those since no actions are allowed
        cfgSources.remove({'isArchived':true});

        if (this.reposCount === 0) {
            setLoadError(true);
        } else {
            setLoadSuccess(true);
        }
    };

    getReposPagination = async (cursor, increment) => {
        const { client, updateChip, name, setAvailableRepos, log } = this.props;

        let data = await client.query({
            query: GET_GITHUB_REPOS,
            variables: {repo_cursor: cursor, increment: increment, org_name: name},
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        });
        log.info(data);
        updateChip(data.data.rateLimit);
        if (data.data.organization !== null) {
            setAvailableRepos(data.data.organization.repositories.totalCount);
            let lastCursor = await this.loadRepositories(data);
            let queryIncrement = calculateQueryIncrement(this.reposCount, data.data.organization.repositories.totalCount);
            log.info(cfgSources.find({'org.id': data.data.organization.id}));
            log.info('Current count: ' + this.reposCount);
            log.info('Total count: ' + data.data.organization.repositories.totalCount);
            log.info('Query increment: ' + queryIncrement);
            if (queryIncrement > 0) {
                await this.getReposPagination(lastCursor, queryIncrement);
            }
        }
    };

    loadRepositories = async (data) => {
        const { incrementLoadedRepos, log } = this.props;
        let lastCursor = null;
        for (var currentRepo of data.data.organization.repositories.edges) {
            log.info('Inserting: ' + currentRepo.node.name);
            let existNode = cfgSources.findOne({id: currentRepo.node.id});
            let nodeActive = false;
            if (existNode !== undefined) {
                nodeActive = cfgSources.findOne({id: currentRepo.node.id}).active;
            }
            let repoObj = JSON.parse(JSON.stringify(currentRepo.node)); //TODO - Replace this with something better to copy object ?
            repoObj['org'] = {
                login: data.data.organization.login,
                name: data.data.organization.name,
                id: data.data.organization.id,
                url: data.data.organization.url,
            };
            repoObj['active'] = nodeActive;
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
    loadFlag: PropTypes.bool,
    loading: PropTypes.bool,
    name: PropTypes.string,
    log: PropTypes.object.isRequired,

    setLoadFlag: PropTypes.func,
    setLoading: PropTypes.func,
    setLoadError: PropTypes.func,
    setLoadSuccess: PropTypes.func,
    updateChip: PropTypes.func,

    setAvailableRepos: PropTypes.func,
    setLoadedRepos: PropTypes.func,
    incrementLoadedRepos: PropTypes.func,
};

const mapState = state => ({
    loadFlag: state.githubFetchOrgRepos.loadFlag,
    loading: state.githubFetchOrgRepos.loading,

    name: state.githubFetchOrgRepos.name,
    log: state.global.log,
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
