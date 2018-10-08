import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgMilestones } from "../../Minimongo";

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
        console.log('CreateMilestones - Start load');
        const { client, setChipRemaining, setLoading, setLoadError, setLoadSuccess, setLoadedCount, milestones, action, incrementLoadedCount, updateMilestones } = this.props;
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedCount(0);

        console.log(milestones);
        for (let milestone of milestones) {
            let result = false;
            if (action === 'close') {
                try {
                    console.log(milestone);
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
            } else if (action === 'deleteClosedEmpty') {
                try {
                    console.log(milestone);
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
            } else if (action === 'create') {
                try {
                    /*
                    result = await this.octokit.issues.createMilestone({
                        owner: repo.org.login,
                        repo: repo.name,
                        title: milestoneTitle,
                        due_on: milestoneDueOn,
                    });
                    */
                }
                catch (error) {
                    console.log(error);
                }
                console.log(result);
                if (result !== false) {
                    setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
/*                    await cfgLabels.upsert({
                        id: labelObj.id
                    }, {
                        $set: labelObj
                    });*/
                }
            }
        }
        setLoadSuccess(true);
        setLoading(false);
        updateMilestones();
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

    milestones: state.milestonesEdit.milestones,
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
