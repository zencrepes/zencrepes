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
            repos,
            milestoneTitle,
            milestoneDescription,
            milestoneDueDate,
            onSuccess,
            incrementLoadedCount,
        } = this.props;
        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedCount(0);

        console.log(milestones);
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
                console.log(error);
            }
            console.log(result);
            if (result !== false) {
                setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                // From the milestone number, fetch single milestone data from Github through the Graphql API
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
                    console.log(error);
                }
                console.log(data);
                if (data.data !== null) {
                    const milestoneObj = {
                        ...data.data.repository.milestone,
                        repo: repo,
                        org: repo.org,
                    };
                    console.log(milestoneObj);
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

};

const mapState = state => ({
    loadFlag: state.milestonesCreate.loadFlag,
    loading: state.milestonesCreate.loading,

    onSuccess: state.milestonesCreate.onSuccess,

    milestoneTitle: state.milestonesCreate.milestoneTitle,
    milestoneDescription: state.milestonesCreate.milestoneDescription,
    milestoneDueDate: state.milestonesCreate.milestoneDueDate,

    repos: state.milestonesCreate.repos,
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
