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
        const { setLoadFlag, loadFlag, loading } = this.props;
        if (loadFlag && loading === false) {
            setLoadFlag(false); // Right away set loadRepositories to false
            this.load();           // Logic to load Issues
        }
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    load = async () => {
        const {
            setLoading,
            setLoadingTitle,
            name,
            log,
            setLoadingSuccessMsg,
            setLoadingSuccess,
            onSuccess,
        } = this.props;

        setLoading(true);  // Set loading to true to indicate content is actually loading.
        setLoadingTitle('Fetching repositories from ' + name);
        await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading

        this.reposCount = 0;
        log.info('Getting repositories from Organization: ' + name);
        await this.getReposPagination(null, 10);

        if (this.reposCount > 0) {
            setLoadingSuccessMsg('Found ' + this.reposCount + ' repositories');
            setLoadingSuccess(true);
        }

        setLoading(false);
        log.info('Finished loading from Organization: ' + name);

        // Remove archived repositories, we don't want to take care of those since no actions are allowed
        cfgSources.remove({'isArchived':true});
        onSuccess();
    };

    getReposPagination = async (cursor, increment) => {
        const {
            client,
            updateChip,
            name,
            setAvailableRepos,
            log,
            setLoadingIterateCurrent,
            setLoadingIterateTotal,
            setLoadingSuccessMsg,
            setLoadingSuccess,

        } = this.props;
        if (this.props.loading) {
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
                setLoadingIterateCurrent(this.reposCount);
                setLoadingIterateTotal(data.data.organization.repositories.totalCount);
                if (queryIncrement > 0) {
                    await this.getReposPagination(lastCursor, queryIncrement);
                }
            } else {
                setLoadingSuccessMsg('Organization not found');
                setLoadingSuccess(false);
            }
        }
    };

    loadRepositories = async (data) => {
        const {
            incrementLoadedRepos,
            log,
            setLoadingMsg,
        } = this.props;
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
        setLoadingMsg('Loaded ' + this.reposCount + ' repositories');
        return lastCursor;
    };

    render() {
        return null;
    }
}

FetchOrgRepos.propTypes = {
    loadFlag: PropTypes.bool,
    loading: PropTypes.bool,
    onSuccess: PropTypes.func.isRequired,
    name: PropTypes.string,
    log: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setAvailableRepos: PropTypes.func.isRequired,
    setLoadedRepos: PropTypes.func.isRequired,
    incrementLoadedRepos: PropTypes.func.isRequired,

    setLoading: PropTypes.func.isRequired,
    setLoadingTitle: PropTypes.func.isRequired,
    setLoadingMsg: PropTypes.func.isRequired,
    setLoadingMsgAlt: PropTypes.func.isRequired,
    setLoadingIterateCurrent: PropTypes.func.isRequired,
    setLoadingIterateTotal: PropTypes.func.isRequired,
    setLoadingSuccessMsg: PropTypes.func.isRequired,
    setLoadingSuccess: PropTypes.func.isRequired,

    updateChip: PropTypes.func.isRequired,
};

const mapState = state => ({
    loadFlag: state.githubFetchOrgRepos.loadFlag,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,

    name: state.githubFetchOrgRepos.name,
    log: state.global.log,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchOrgRepos.setLoadFlag,

    setAvailableRepos: dispatch.githubFetchOrgRepos.setAvailableRepos,
    setLoadedRepos: dispatch.githubFetchOrgRepos.setLoadedRepos,
    incrementLoadedRepos: dispatch.githubFetchOrgRepos.incrementLoadedRepos,

    setLoading: dispatch.loading.setLoading,
    setLoadingTitle: dispatch.loading.setLoadingTitle,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingIterateCurrent: dispatch.loading.setLoadingIterateCurrent,
    setLoadingIterateTotal: dispatch.loading.setLoadingIterateTotal,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(FetchOrgRepos));
