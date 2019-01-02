import { Meteor } from 'meteor/meteor';
import { Component } from 'react'

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
            milestones,
            action,
            incrementLoadedCount,
            updateMilestones,
            onSuccess,

            editMilestoneTitle,
            editMilestoneDescription,
            editMilestoneDueDate,
            log,
        } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedCount(0);

        log.info(milestones);
        for (let milestone of milestones) {
            log.info(milestone);
            let result = false;
            if (action === 'close') {
                try {
                    result = await this.octokit.issues.updateMilestone({
                        owner: milestone.org.login,
                        repo: milestone.repo.name,
                        number: milestone.number,
                        state: 'closed',
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    incrementLoadedCount(1);
                    await cfgMilestones.update({
                        id: milestone.id
                    }, {
                        $set: {state: 'CLOSED'}
                    });
                }
            } else if (action === 'delete') {
                try {
                    result = await this.octokit.issues.deleteMilestone({
                        owner: milestone.org.login,
                        repo: milestone.repo.name,
                        number: milestone.number,
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    incrementLoadedCount(1);
                    cfgMilestones.remove({id: milestone.id});
                }
            } else if (action === 'update') {
                let updatePayload = {
                    owner: milestone.org.login,
                    repo: milestone.repo.name,
                    number: milestone.number,
                };
                if (editMilestoneTitle !== null) {
                    updatePayload = {
                        ...updatePayload,
                        title: editMilestoneTitle,
                    }
                }
                if (editMilestoneDescription !== null) {
                    updatePayload = {
                        ...updatePayload,
                        description: editMilestoneDescription,
                    }
                }
                if (editMilestoneDueDate !== null) {
                    log.info(editMilestoneDueDate);
                    updatePayload = {
                        ...updatePayload,
                        due_on: editMilestoneDueDate,
                    }
                }
                log.info(updatePayload);
                try {
                    result = await this.octokit.issues.updateMilestone(updatePayload);
                }
                catch (error) {
                    log.info(error);
                }
                log.info(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                    incrementLoadedCount(1);

                    let data = {};
                    try {
                        data = await client.query({
                            query: GET_GITHUB_SINGLE_MILESTONE,
                            variables: {
                                org_name: milestone.org.login,
                                repo_name: milestone.repo.name,
                                milestone_number: milestone.number
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
                            repo: milestone.repo,
                            org: milestone.org,
                        };
                        log.info(milestoneObj);
                        await cfgMilestones.upsert({
                            id: milestoneObj.id
                        }, {
                            $set: milestoneObj
                        });
                    }
                }
            }
        }
        setLoadSuccess(true);
        setLoading(false);
        updateMilestones();
        if (onSuccess !== null && onSuccess !== undefined) {
            log.info(onSuccess);
            onSuccess();
        }
    };

    render() {
        return null;
    }
}

Data.propTypes = {
    loadFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    action: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    milestones: PropTypes.array.isRequired,
    editMilestoneTitle: PropTypes.string.isRequired,
    editMilestoneDescription: PropTypes.string.isRequired,
    editMilestoneDueDate: PropTypes.string.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadError: PropTypes.func.isRequired,
    setLoadSuccess: PropTypes.func.isRequired,
    setLoadedCount: PropTypes.func.isRequired,
    incrementLoadedCount: PropTypes.func.isRequired,
    updateMilestones: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,
    setChipRemaining: PropTypes.func.isRequired,

    log: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
};

const mapState = state => ({
    loadFlag: state.milestonesEdit.loadFlag,
    loading: state.milestonesEdit.loading,
    action: state.milestonesEdit.action,

    onSuccess: state.milestonesEdit.onSuccess,

    milestones: state.milestonesEdit.milestones,

    editMilestoneTitle: state.milestonesEdit.editMilestoneTitle,
    editMilestoneDescription: state.milestonesEdit.editMilestoneDescription,
    editMilestoneDueDate: state.milestonesEdit.editMilestoneDueDate,

    log: state.global.log,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesEdit.setLoadFlag,
    setLoading: dispatch.milestonesEdit.setLoading,
    setLoadError: dispatch.milestonesEdit.setLoadError,
    setLoadSuccess: dispatch.milestonesEdit.setLoadSuccess,

    setLoadedCount: dispatch.milestonesEdit.setLoadedCount,
    incrementLoadedCount: dispatch.milestonesEdit.incrementLoadedCount,

    updateMilestones: dispatch.milestonesView.updateMilestones,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(Data));
