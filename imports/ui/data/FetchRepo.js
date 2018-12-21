import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLEREPO from '../../graphql/getSingleRepo.graphql';

import { cfgSources } from './Minimongo.js';

/*
Load data about GitHub Orgs
 */
class FetchRepo extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('ScanOrg - Initiating load');
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    load = async () => {
        const { client, updateChip, setLoading, setLoadError, setLoadSuccess, orgName, repoName, setRepoData } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        console.log('Getting data about Organization: ' + orgName + ' - Repository: ' + repoName);

        let data = await client.query({
            query: GET_GITHUB_SINGLEREPO,
            variables: {org_name: orgName, repo_name: repoName},
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        });

        console.log(data);

        updateChip(data.data.rateLimit);
        if (data.data.repository === null) {
            setLoadError(true);
        } else {
            let repoObj = JSON.parse(JSON.stringify(data.data.repository)); //TODO - Replace this with something better to copy object ?
            repoObj['org'] = {
                login: data.data.repository.owner.login,
                name: data.data.repository.owner.login,
                id: data.data.repository.owner.id,
                url: data.data.repository.owner.url,
            };
            repoObj['active'] = true;
            setRepoData(repoObj);
            await cfgSources.upsert({
                id: repoObj.id
            }, {
                $set: repoObj
            });
            setLoadSuccess(true);
        }
        setLoading(false);

        // Remove archived repositories, we don't want to take care of those since no actions are allowed
        cfgSources.remove({'isArchived':true});
    };

    render() {
        return null;
    }
}

FetchRepo.propTypes = {
    loading: PropTypes.bool,
    loadFlag: PropTypes.bool,
    orgName: PropTypes.string,
    repoName: PropTypes.string,

    setLoadFlag: PropTypes.func,
    setLoading: PropTypes.func,
    setLoadError: PropTypes.func,
    setLoadSuccess: PropTypes.func,
    updateChip: PropTypes.func,
    setRepoData: PropTypes.func,
};

const mapState = state => ({
    loadFlag: state.githubFetchRepo.loadFlag,
    loading: state.githubFetchRepo.loading,

    orgName: state.githubFetchRepo.orgName,
    repoName: state.githubFetchRepo.repoName,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchRepo.setLoadFlag,
    setLoading: dispatch.githubFetchRepo.setLoading,
    setLoadError: dispatch.githubFetchRepo.setLoadError,
    setLoadSuccess: dispatch.githubFetchRepo.setLoadSuccess,

    setRepoData: dispatch.githubFetchRepo.setRepoData,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(FetchRepo));
