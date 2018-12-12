import React, { Component } from 'react'

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

    shouldComponentUpdate(nextProps, nextState) {
        const { loadSuccess, loadFlag } = this.props;
        if (loadFlag !== nextProps.loadFlag) {
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    };

    load = async () => {
        console.log('MilestonesEdit - Start load');
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
        } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedCount(0);

        console.log(milestones);
        for (let milestone of milestones) {
            console.log(milestone);
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
                    console.log(error);
                }
                console.log(result);
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
                    console.log(error);
                }
                console.log(result);
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
                    updatePayload = {
                        ...updatePayload,
                        due_on: editMilestoneDueDate.toISOString(),
                    }
                }
                try {
                    result = await this.octokit.issues.updateMilestone(updatePayload);
                }
                catch (error) {
                    console.log(error);
                }
                console.log(result);
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
                        console.log(error);
                    }
                    console.log(data);
                    if (data.data !== null) {
                        const milestoneObj = {
                            ...data.data.repository.milestone,
                            repo: milestone.repo,
                            org: milestone.org,
                        };
                        console.log(milestoneObj);
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
            console.log(onSuccess);
            onSuccess();
        }
    };

    render() {
        return null;
    }
}

Data.propTypes = {

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
