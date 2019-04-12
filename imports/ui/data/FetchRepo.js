import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLEREPO from '../../graphql/getSingleRepo.graphql';

import { cfgSources } from './Minimongo.js';
import { withSnackbar } from 'notistack';

/*
Load data about GitHub Orgs
 */
class FetchRepo extends Component {
    constructor (props) {
        super(props);
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag, loading } = this.props;
        if (loadFlag && loading === false) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    load = async () => {
        const {
            client,
            updateChip,
            setLoading,
            setLoadingTitle,
            setLoadingSuccessMsg,
            setLoadingSuccess,
            setLoadingMsg,
            orgName,
            repoName,
            log,
            onSuccess,
            enqueueSnackbar,
        } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        log.info('Getting data about Organization: ' + orgName + ' - Repository: ' + repoName);
        setLoadingTitle('Fetching data... ');
        setLoadingMsg('Pulling data about repository: ' + repoName + ' from organization: ' + orgName);

        let data = await client.query({
            query: GET_GITHUB_SINGLEREPO,
            variables: {org_name: orgName, repo_name: repoName},
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        });

        if (data.data.errors !== undefined && data.data.errors.length > 0) {
            data.data.errors.forEach((error) => {
                enqueueSnackbar(error.message, {
                    variant: 'warning',
                    persist: true,
                });
            });
        }

        log.info(data);

        updateChip(data.data.rateLimit);
        if (data.data.repository !== null) {
            let repoObj = JSON.parse(JSON.stringify(data.data.repository)); //TODO - Replace this with something better to copy object ?
            repoObj['org'] = {
                login: data.data.repository.owner.login,
                name: data.data.repository.owner.login,
                id: data.data.repository.owner.id,
                url: data.data.repository.owner.url,
            };
            repoObj['active'] = true;
            await cfgSources.upsert({
                id: repoObj.id
            }, {
                $set: repoObj
            });
            setLoadingSuccess(true);
            setLoadingSuccessMsg('Repository loaded');
        }
        setLoading(false);
        // Remove archived repositories, we don't want to take care of those since no actions are allowed
        cfgSources.remove({'isArchived':true});
        onSuccess();
    };

    render() {
        return null;
    }
}

FetchRepo.propTypes = {
    loadFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired,

    orgName: PropTypes.string,
    repoName: PropTypes.string,

    log: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,

    setLoadFlag: PropTypes.func.isRequired,

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
    loadFlag: state.githubFetchRepo.loadFlag,
    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,

    orgName: state.githubFetchRepo.orgName,
    repoName: state.githubFetchRepo.repoName,

    log: state.global.log,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchRepo.setLoadFlag,

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

export default connect(mapState, mapDispatch)(withApollo(withSnackbar(FetchRepo)));
