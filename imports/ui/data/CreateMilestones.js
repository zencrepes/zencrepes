import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLEREPO from '../../graphql/getSingleRepo.graphql';

import { cfgSources } from './Minimongo.js';
import {cfgLabels} from "./Minimongo";
import fibonacci from "fibonacci-fast";

import GitHubApi from '@octokit/rest';

/*
Load data about Github Orgs
 */
class CreateMilestones extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('CreateMilestones - Initiating load');
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    };

    load = async () => {
        const { client, setChipRemaining, setLoading, setLoadError, setLoadSuccess, repos } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);

        for (let repo of repos) {
            console.log('Creating milestone in repo: ');
            console.log(repo);

            if (action === 'create') {
                /*
                let missingPointsLabels = _.difference(points, labels);
                for (let label of missingPointsLabels) {
                    console.log('Processing: ' + label);
                    let result = false;
                    try {
                        result = await this.octokit.issues.createLabel({
                            owner: repo.org.login,
                            repo: repo.name,
                            name: label,
                            color: color.replace('#', ''),
                            description: 'Story points estimate'
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                    console.log(result);
                    if (result !== false) {
                        setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                        let labelObj = {
                            id: result.data.node_id,
                            url: result.data.url,
                            color: result.data.color,
                            name: result.data.name,
                            isDefault: result.data.default,
                            issues: {totalCount: 0},
                            repo: repo,
                            refreshed: true,
                        };
                        await cfgLabels.upsert({
                            id: labelObj.id
                        }, {
                            $set: labelObj
                        });
                    }
                }
                */
            }
        }
        setLoadSuccess(true);
        setLoading(false);
    };

    render() {
        return null;
    }
}

CreateMilestones.propTypes = {

};

const mapState = state => ({
    loadFlag: state.githubCreateMilestones.loadFlag,
    loading: state.githubCreateMilestones.loading,
    action: state.githubCreateMilestones.action,

    repos: state.githubCreateMilestones.repos,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubCreateMilestones.setLoadFlag,
    setLoading: dispatch.githubCreateMilestones.setLoading,
    setLoadError: dispatch.githubCreateMilestones.setLoadError,
    setLoadSuccess: dispatch.githubCreateMilestones.setLoadSuccess,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(CreateMilestones));
