import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgLabels } from './Minimongo.js';

import GitHubApi from '@octokit/rest';

class Labels extends Component {
    constructor (props) {
        super(props);

        this.octokit = new GitHubApi();
        this.octokit.authenticate({
            type: 'oauth',
            token: Meteor.user().services.github.accessToken
        });

        this.state = {

        };
    }

    componentDidMount() {
        console.log('Labels - Initialized');

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag, loading} = this.props;

        if (loadFlag && loading === false) {
            setLoadFlag(false); // Right away set loadLabels to false
            this.loadLabels(); // Logic to load Labels
        }

    };

    loadLabels = async () => {
        const { setLoading, selectedRepos} = this.props;
        setLoading(true);  // Set labelsLoading to true to indicate labels are actually updating.

        for (let repo of selectedRepos) {
            console.log('Processing: ' + repo.name);

            if (repo.label === undefined) {
                console.log('Label does not exist, creating');
                console.log(repo.org.login);
                console.log(repo.id);
                const resultread = await this.octokit.issues.getLabels({owner: repo.org.login, repo: repo.name})
                console.log(resultread);

                const result = await this.octokit.issues.createLabel({
                    owner: repo.org.login,
                    repo: repo.name,
                    name: 'test',
                    color: 'ffffff',
                    description: 'this is a test description'
                });
                console.log(result);


            } else {
                console.log('Label does exist, updating');
            }

            /*
            let response = await axios({
                method: 'get',
                url: 'https://api.zenhub.io/p1/repositories/' + repo.databaseId + '/board',
                responseType:'json',
                headers: {'X-Authentication-Token': token},
            });
            */

        }

        console.log('Update completed: ' + selectedRepos.length + ' labels process');
        setLoading(false);
    };

    render() {
        return null;
    }
}

Labels.propTypes = {

};

const mapState = state => ({
    loadFlag: state.labelsconfiguration.loadFlag,
    loading: state.labelsconfiguration.loading,

    selectedRepos: state.labelsconfiguration.selectedRepos
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsconfiguration.setLoadFlag,
    setLoading: dispatch.labelsconfiguration.setLoading,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Labels));
/*
//cfgIssues is the minimongo instance holding all issues imported from GitHub

import GET_GITHUB_LABELS from '../../graphql/getLabels.graphql';
export const cfgLabels = new Mongo.Collection('cfgLabels', {connection: null});
export const localCfgLabels = new PersistentMinimongo2(cfgLabels, 'GAV-Labels');
window.labels = cfgLabels;

//cfgSources is a minimongo instance holding all repositories.
import {cfgSources} from "./Orgs.js";

import calculateQueryIncrement from './calculateQueryIncrement.js';

class Labels extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log('FectchLabels - Initialized');

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadLabels, setLabelsLoading, loadLabels, labelsLoading} = this.props;

        if (loadLabels && labelsLoading === false) {
            setLoadLabels(false); // Right away set loadLabels to false
            this.resetCounts(); // Reset all counts since those will be refresh by loadLabels
            this.loadLabels(); // Logic to load Labels
        }

    }

    resetCounts = () => {
        const { setLoadedLabels, setLoadedLabelsBuffer} = this.props;
        setLoadedLabels(0);
        setLoadedLabelsBuffer(0);
    }

    loadLabels = async () => {
        const { setLabelsLoading, loadLabels, labelsLoading, incrementLoadedLabelsBuffer} = this.props;
        setLabelsLoading(true);  // Set labelsLoading to true to indicate labels are actually loading.

        let allRepos = await cfgSources.find({}).fetch();
        for (let repo of allRepos) {
            if (repo.active === false) {
                //If repo is inactive, delete any labels attached to this repo (if any)
                //let attachedLabels = cfgLabels.find({'repo.id': repo.id}).count();
                //console.log('Repo is inactive, removing: ' + attachedLabels + ' attached labels');
                await cfgLabels.remove({'repo.id': repo.id});
            } else {
                //If repo is active, load all labels attached to this repo (if any)
                if (repo.labels.totalCount > 0) {
                    console.log('Going through repo: ' + repo.name + ' - Is active and has ' + repo.labels.totalCount + ' labels');

                    //First, marked all existing labels are non-refreshed
                    let updatedDocs = cfgLabels.update({'repo.id': repo.id}, {$set: {'refreshed': false}});
                    console.log('Set the refreshed flag to false for: ' + updatedDocs + ' documents');

                    //Increment the labels buffer, used for showing a progress bar buffer value
                    incrementLoadedLabelsBuffer(repo.labels.totalCount);

                    //Load as many labels as possible
                    let queryIncrement = 100;
                    if (repo.labels.totalCount < 100) {
                        queryIncrement = repo.labels.totalCount;
                    }
                    console.log('Query Increment: ' + queryIncrement);

                    if (this.props.labelsLoading)
                        await this.getLabelsPagination(null, queryIncrement, repo);
                }
            }
        }
        console.log('Load completed: ' + cfgLabels.find({}).count() + ' labels loaded');
        setLabelsLoading(false);
    };

    getLabelsPagination = async (cursor, increment, RepoObj) => {
        const { client, labelsLoading } = this.props;
        let data = await client.query({
            query: GET_GITHUB_LABELS,
            variables: {repo_cursor: cursor, increment: increment, org_name: RepoObj.org.login, repo_name: RepoObj.name},
            fetchPolicy: 'no-cache',
        });
        this.props.updateChip(data.data.rateLimit);
        console.log(data);
        if (data.data.viewer.organization.repository !== null) {
            lastCursor = await this.ingestLabels(data);
            console.log(data.data.viewer.organization.repository);
            queryIncrement = calculateQueryIncrement(cfgLabels.find({'repo.id': RepoObj.id, 'refreshed': true}).count(), data.data.viewer.organization.repository.labels.totalCount);
            console.log('Loading data for repo:  ' + RepoObj.name + 'Query Increment: ' + queryIncrement);
            if (queryIncrement > 0) {
                await this.getLabelsPagination(lastCursor, queryIncrement, RepoObj);
            }
        }
    }

    ingestLabels = async (data) => {
        let lastCursor = null;
        console.log(data.data.viewer.organization.repository);

        for (let [key, currentLabel] of Object.entries(data.data.viewer.organization.repository.labels.edges)){
            console.log('Loading label: ' + currentLabel.node.name);
            //let existNode = cfgLabels.findOne({id: currentLabel.node.id});

            let labelObj = {
                id: currentLabel.node.id,
                url: currentLabel.node.url,
                color: currentLabel.node.color,
                name: currentLabel.node.name,
                description: currentLabel.node.description,
                isDefault: currentLabel.node.isDefault,
                repo: {
                    name: data.data.viewer.organization.repository.name,
                    databaseId: data.data.viewer.organization.repository.databaseId,
                    id: data.data.viewer.organization.repository.id,
                    url: data.data.viewer.organization.repository.url,
                    org: {
                        login: data.data.viewer.organization.login,
                        id: data.data.viewer.organization.id,
                        name: data.data.viewer.organization.name,
                        url: data.data.viewer.organization.url
                    },
                },
                createdAt: currentLabel.node.createdAt,
                updatedAt: currentLabel.node.updatedAt,
                issues: currentLabel.node.issues,
                refreshed: true,
            };
            await cfgLabels.upsert({
                id: labelObj.id
            }, {
                $set: labelObj
            });
            this.props.incrementLoadedLabels(1);
            //console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name);
            lastCursor = currentLabel.cursor
        }
        return lastCursor;
    }

    render() {
        return null;
    }
}

Labels.propTypes = {

};

const mapState = state => ({
    loadLabels: state.github.loadLabels,
    labelsLoading: state.github.labelsLoading,
});

const mapDispatch = dispatch => ({
    setLoadLabels: dispatch.github.setLoadLabels,
    setLabelsLoading: dispatch.github.setLabelsLoading,
    incrementLoadedLabels: dispatch.github.incrementLoadedLabels,
    incrementLoadedLabelsBuffer: dispatch.github.incrementLoadedLabelsBuffer,
    setLoadedLabels: dispatch.github.setLoadedLabels,
    setLoadedLabelsBuffer: dispatch.github.setLoadedLabelsBuffer,
    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Labels));

*/