import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

import { Component } from 'react'
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgSources, cfgLabels  } from './Minimongo.js';
import fibonacci from "fibonacci-fast";

import GitHubApi from '@octokit/rest';
import PropTypes from "prop-types";


/*
Load data about GitHub Orgs
 */
class CreatePointsLabels extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });
    }

    componentDidUpdate() {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('CreatePointsLabels - Initiating load');
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    }

    load = async () => {
        const { setChipRemaining, setLoading, setLoadError, setLoadSuccess, maxPoints, action, color, setIncrementCreatedLabels, setIncrementUpdatedRepos, setCreatedLabels, setUpdatedRepos } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setCreatedLabels(0);
        setUpdatedRepos(0);

        let points = fibonacci.array(2, fibonacci.find(maxPoints).index + 1).map(x => 'SP:' + x.number.toString());
        console.log(points);
        let repos = cfgSources.find({active: true, pushLabels: true}).fetch();
        //let repos = cfgSources.find({active: true, pushLabels: true}).map(repo => {
        for (let repo of repos) {
            console.log(repo);
            //Get Labels for repo
            let labels = cfgLabels.find({'repo.id': repo.id}).map(label => label.name);

            if (action === 'create') {
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
            }
            else if (action === 'delete') {
                for (let label of points) {
                    console.log('Processing: ' + label);
                    let result = false;
                    try {
                        if (labels.includes(label)) {
                            result = await this.octokit.issues.deleteLabel({
                                owner: repo.org.login,
                                repo: repo.name,
                                name: label,
                            });
                        } else {
                            console.log('Label: ' + label + ' does not exist in repo: ' + repo.name + ', skipping...');
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                    console.log(result);
                    if (result !== false) {
                        setChipRemaining(parseInt(result.headers['x-ratelimit-remaining']));
                        cfgLabels.remove({'repo.id': repo.id, name: 'label'});
                        console.log('Label: ' + label + ' removed from repo: ' + repo.name);
                    }
                }
            }
            setIncrementUpdatedRepos(1);
            setIncrementCreatedLabels(points.length);
        }

        setLoadSuccess(true);
        setLoading(false);
    };

    render() {
        return null;
    }
}

CreatePointsLabels.propTypes = {
    loadFlag: PropTypes.bool,
    loading: PropTypes.bool,
    action: PropTypes.string,
    maxPoints: PropTypes.number,
    color: PropTypes.string,

    setLoadFlag: PropTypes.func,
    setLoading: PropTypes.func,
    setLoadError: PropTypes.func,
    setLoadSuccess: PropTypes.func,
    setCreatedLabels: PropTypes.func,
    setUpdatedRepos: PropTypes.func,
    setIncrementCreatedLabels: PropTypes.func,
    setIncrementUpdatedRepos: PropTypes.func,
    updateChip: PropTypes.func,
    setChipRemaining: PropTypes.func,
};

const mapState = state => ({
    loadFlag: state.githubCreatePointsLabels.loadFlag,
    loading: state.githubCreatePointsLabels.loading,
    action: state.githubCreatePointsLabels.action,

    maxPoints: state.githubLabels.maxPoints,
    color: state.githubLabels.color,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubCreatePointsLabels.setLoadFlag,
    setLoading: dispatch.githubCreatePointsLabels.setLoading,
    setLoadError: dispatch.githubCreatePointsLabels.setLoadError,
    setLoadSuccess: dispatch.githubCreatePointsLabels.setLoadSuccess,

    setCreatedLabels: dispatch.githubCreatePointsLabels.setCreatedLabels,
    setUpdatedRepos: dispatch.githubCreatePointsLabels.setUpdatedRepos,
    setIncrementCreatedLabels: dispatch.githubCreatePointsLabels.setIncrementCreatedLabels,
    setIncrementUpdatedRepos: dispatch.githubCreatePointsLabels.setIncrementUpdatedRepos,

    updateChip: dispatch.chip.updateChip,
    setChipRemaining: dispatch.chip.setRemaining,
});

export default connect(mapState, mapDispatch)(withApollo(CreatePointsLabels));
