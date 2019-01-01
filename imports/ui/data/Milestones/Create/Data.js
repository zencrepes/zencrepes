import { Component } from 'react'
import { Meteor } from 'meteor/meteor';

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgMilestones } from "../../Minimongo";

import GET_GITHUB_SINGLE_MILESTONE from '../../../../graphql/getSingleMilestone.graphql';


import GitHubApi from '@octokit/rest';

class Data extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });
    }

    shouldComponentUpdate(nextProps) {
        const { loadFlag } = this.props;
        if (loadFlag !== nextProps.loadFlag) {
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    load = async () => {
        const {
            client,
            setChipRemaining,
            setLoading,
            setLoadError,
            setLoadSuccess,
            setLoadedCount,
            repos,
            milestoneTitle,
            milestoneDescription,
            milestoneDueDate,
            onSuccess,
            incrementLoadedCount,
            log,
        } = this.props;
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedCount(0);

        log.info(repos);
        for (let repo of repos) {
            let result = false;
            try {
                let createPayload = {
                    owner: repo.org.login,
                    repo: repo.name,
                    title: milestoneTitle,
                };
                if (milestoneDescription !== null) {
                    createPayload = {
                        ...createPayload,
                        description: milestoneDescription,
                    }
                }
                if (milestoneDueDate !== null) {
                    createPayload = {
                        ...createPayload,
                        due_on: milestoneDueDate,
                    }
                }
                result = await this.octokit.issues.createMilestone(createPayload);
            }
            catch (error) {
                log.warn(error);
            }
            log.info(result);
            if (result !== false) {
                setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                // From the milestone number, fetch single milestone data from GitHub through the Graphql API
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_SINGLE_MILESTONE,
                        variables: {
                            org_name: repo.org.login,
                            repo_name: repo.name,
                            milestone_number: result.data.number
                        },
                        fetchPolicy: 'no-cache',
                        errorPolicy: 'ignore',
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(data);
                if (data.data !== null) {
                    const milestoneObj = {
                        ...data.data.repository.milestone,
                        repo: repo,
                        org: repo.org,
                    };
                    log.info(milestoneObj);
                    await cfgMilestones.upsert({
                        id: milestoneObj.id
                    }, {
                        $set: milestoneObj
                    });
                }
            }
            incrementLoadedCount(1);
        }
        setLoadSuccess(true);
        setLoading(false);
        onSuccess();
    };

    render() {
        return null;
    }
}

Data.propTypes = {
    loadFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    milestoneTitle: PropTypes.string.isRequired,
    milestoneDescription: PropTypes.string.isRequired,
    milestoneDueDate: PropTypes.string.isRequired,
    repos: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadError: PropTypes.func.isRequired,
    setLoadSuccess: PropTypes.func.isRequired,
    setLoadedCount: PropTypes.func.isRequired,
    incrementLoadedCount: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,
    setChipRemaining: PropTypes.func.isRequired,

    log: PropTypes.object.isRequired,
};

const mapState = state => ({
    loadFlag: state.milestonesCreate.loadFlag,
    loading: state.milestonesCreate.loading,

    onSuccess: state.milestonesCreate.onSuccess,

    milestoneTitle: state.milestonesCreate.milestoneTitle,
    milestoneDescription: state.milestonesCreate.milestoneDescription,
    milestoneDueDate: state.milestonesCreate.milestoneDueDate,

    repos: state.milestonesCreate.repos,

    log: state.global.log,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesCreate.setLoadFlag,
    setLoading: dispatch.milestonesCreate.setLoading,
    setLoadError: dispatch.milestonesCreate.setLoadError,
    setLoadSuccess: dispatch.milestonesCreate.setLoadSuccess,

    setLoadedCount: dispatch.milestonesCreate.setLoadedCount,
    incrementLoadedCount: dispatch.milestonesCreate.incrementLoadedCount,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(Data));
