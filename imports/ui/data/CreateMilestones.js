import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLEREPO from '../../graphql/getSingleRepo.graphql';

import { cfgSources } from './Minimongo.js';
import {cfgLabels, cfgMilestones} from "./Minimongo";
import fibonacci from "fibonacci-fast";

import GitHubApi from '@octokit/rest';

import Snackbar from "@material-ui/core/Snackbar";

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

    shouldComponentUpdate(nextProps, nextState) {
        const { loadSuccess, loadFlag } = this.props;
        if (loadFlag !== nextProps.loadFlag) {
            console.log('CreateMilestones - Will update because of change in loadFlag');
            return true;
        } else if (loadSuccess !== nextProps.loadSuccess) {
            console.log('CreateMilestones - Will update because of change in loadSuccess');
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag, loadSuccess, setLoadSuccess } = this.props;
        if (loadFlag) {
            console.log('CreateMilestones - Initiating load');
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
            }, 2000);
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

                //const result = await octokit.issues.createMilestone({owner, repo, title, state, description, due_on})

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
        updateMilestones();
    };

    render() {
        const {loadSuccess, loadedCount} = this.props;
        console.log('Render CreateMilestones');
        console.log(loadSuccess);
        console.log(loadedCount);
        return (
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={loadSuccess}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Loaded or updated {loadedCount} milestones</span>}
            />
        );
        //return null;
    }
}

CreateMilestones.propTypes = {

};

const mapState = state => ({
    loadFlag: state.githubCreateMilestones.loadFlag,
    loading: state.githubCreateMilestones.loading,
    action: state.githubCreateMilestones.action,

    milestones: state.githubCreateMilestones.milestones,

    loadedCount: state.githubCreateMilestones.loadedCount,
    loadSuccess: state.githubCreateMilestones.loadSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubCreateMilestones.setLoadFlag,
    setLoading: dispatch.githubCreateMilestones.setLoading,
    setLoadError: dispatch.githubCreateMilestones.setLoadError,
    setLoadSuccess: dispatch.githubCreateMilestones.setLoadSuccess,

    setLoadedCount: dispatch.githubCreateMilestones.setLoadedCount,
    incrementLoadedCount: dispatch.githubCreateMilestones.incrementLoadedCount,

    updateMilestones: dispatch.milestones.updateMilestones,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(CreateMilestones));
