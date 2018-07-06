import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

//cfgIssues is the minimongo instance holding all issues imported from GitHub

import GET_GITHUB_ISSUES from '../../graphql/getIssues.graphql';
export const cfgIssues = new Mongo.Collection('cfgIssues', {connection: null});
export const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues');
window.issues = cfgIssues;

import GET_GITHUB_LABELS from '../../graphql/getLabels.graphql';
export const cfgLabels = new Mongo.Collection('cfgLabels', {connection: null});
export const localCfgLabels = new PersistentMinimongo2(cfgLabels, 'GAV-Labels');
window.labels = cfgLabels;

//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//cfgSources is a minimongo instance holding all repositories.
import {cfgSources} from "./Orgs.js";

import calculateQueryIncrement from './calculateQueryIncrement.js';

//Get various stats around issue timing
function getIssuesStats(createdAt, updatedAt, closedAt) {
    //This issue has been opened for X days
    let openedDuring = null;
    if (createdAt !== null && closedAt !== null) {
        openedDuring = Math.round((new Date(closedAt) - new Date(createdAt)) / (1000 * 3600 * 24), 0);
    }

    //This issue was first opened X days ago
    let createdSince = null;
    if (createdAt !== null) {
        createdSince = Math.round((new Date() - new Date(createdAt)) / (1000 * 3600 * 24), 0);
    }
    //This issue was closed X days ago
    let closedSince = null;
    if (closedAt !== null) {
        closedSince = Math.round((new Date() - new Date(closedAt)) / (1000 * 3600 * 24), 0);
    }
    //This issue was last updated X days ago
    let updatedSince = null;
    if (updatedAt !== null) {
        updatedSince = Math.round((new Date() - new Date(updatedAt)) / (1000 * 3600 * 24), 0);
    }
    let stats = {
        openedDuring: openedDuring,
        createdSince: createdSince,
        closedSince: closedSince,
        updatedSince: updatedSince,
    };
    return stats;
}

class Repos extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log('Data Repos - Initialized');

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setIssuesLoadFlag, issuesLoading, issuesLoadFlag, setLabelsLoadFlag, labelsLoading, labelsLoadFlag} = this.props;

        let triggerLoad = false;

        if (issuesLoadFlag && issuesLoading === false) {
            triggerLoad = true;
            setIssuesLoadFlag(false); // Right away set loadIssues to false
            this.resetIssuesCounts(); // Reset all counts since those will be refresh by loadIssues
        }

        if (labelsLoadFlag && labelsLoading === false) {
            triggerLoad = true;
            setLabelsLoadFlag(false); // Right away set loadIssues to false
            this.resetLabelsCounts(); // Reset all counts since those will be refresh by loadIssues
        }

        if (triggerLoad === true) {
            this.loadReposContent(); // Logic to load Issues
        }
    };

    resetIssuesCounts = () => {
        const { setIssuesLoadedCount, setIssuesLoadedCountBuffer} = this.props;
        setIssuesLoadedCount(0);
        setIssuesLoadedCountBuffer(0);
    };

    resetLabelsCounts = () => {
        const { setLabelsLoadedCount, setLabelsLoadedCountBuffer} = this.props;
        setLabelsLoadedCount(0);
        setLabelsLoadedCountBuffer(0);
    };

    loadReposContent = async () => {
        const { setIssuesLoading, incrementIssuesLoadedCountBuffer, setLabelsLoading, setIssuesTotalCount, setLabelsTotalCount, incrementLabelsLoadedCountBuffer} = this.props;
        await setIssuesLoading(true);  // Set to true to indicate issues are actually loading.
        await setLabelsLoading(true);  // Set to true to indicate labels are actually loading.

        //First action is to calculate the number of expected issues and labels to be loaded
        let issuesTotalCount = cfgSources.find({active: true}).fetch()
            .map(repo => repo.issues.totalCount)
            .reduce((acc, count) => acc + count, 0);
        setIssuesTotalCount(issuesTotalCount);

        let labelsTotalCount = cfgSources.find({active: true}).fetch()
            .map(repo => repo.labels.totalCount)
            .reduce((acc, count) => acc + count, 0);
        setLabelsTotalCount(labelsTotalCount);

        for (let repo of cfgSources.find({}).fetch()) {
            if (repo.active === false) {
                //If repo is inactive, delete any issues attached to this repo (if any)
                //let attachedIssues = cfgIssues.find({'repo.id': repo.id}).count();
                //console.log('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + attachedIssues + ' attached issues');
                //console.log(cfgIssues.find({'repo.id': repo.id}).fetch());
                await cfgIssues.remove({'repo.id': repo.id});
                await cfgLabels.remove({'repo.id': repo.id});
            } else {
                console.log('Processing repo: ' + repo.name + ' - Is active and has ' + repo.issues.totalCount + ' issues and ' + repo.labels.totalCount + ' labels');

                //If repo is active, load all issues attached to this repo (if any)
                if (repo.issues.totalCount > 0) {
                    //First, marked all existing issues are non-refreshed
                    let updatedDocs = cfgIssues.update({'repo.id': repo.id}, {$set: {'refreshed': false}});

                    //Increment the issues buffer, used for showing a progress bar buffer value
                    incrementIssuesLoadedCountBuffer(repo.issues.totalCount);

                    //Load as many issues as possible
                    let queryIncrement = 100;
                    if (repo.issues.totalCount < 100) {
                        queryIncrement = repo.issues.totalCount;
                    }
                    console.log('Issues import: ' + repo.name + ' - Query increment: ' + queryIncrement);

                    if (this.props.issuesLoading)
                        await this.getIssuesPagination(null, queryIncrement, repo);


                }
                if (repo.labels.totalCount > 0) {
                    //First, marked all existing issues are non-refreshed
                    let updatedDocs = cfgLabels.update({'repo.id': repo.id}, {$set: {'refreshed': false}});

                    //Increment the issues buffer, used for showing a progress bar buffer value
                    incrementLabelsLoadedCountBuffer(repo.labels.totalCount);

                    //Load as many issues as possible
                    let queryIncrement = 100;
                    if (repo.labels.totalCount < 100) {
                        queryIncrement = repo.labels.totalCount;
                    }
                    console.log('Labels import: ' + repo.name + ' - Query increment: ' + queryIncrement);

                    if (this.props.labelsLoading)
                        await this.getLabelsPagination(null, queryIncrement, repo);
                }
            }
        }
        console.log('Load completed: ' + cfgIssues.find({}).count() + ' issues and ' + cfgLabels.find({}).count() + ' labels loaded');

        setIssuesLoading(false);  // Set to true to indicate issues are done loading.
        setLabelsLoading(false);  // Set to true to indicate labels are done loading.
    };

    getIssuesPagination = async (cursor, increment, RepoObj) => {
        const { client } = this.props;
        let data = await client.query({
            query: GET_GITHUB_ISSUES,
            variables: {repo_cursor: cursor, increment: increment, org_name: RepoObj.org.login, repo_name: RepoObj.name},
            fetchPolicy: 'no-cache',
        });

        this.props.updateChip(data.data.rateLimit);
        if (data.data.viewer.organization.repository !== null) {
            lastCursor = await this.ingestIssues(data);
            queryIncrement = calculateQueryIncrement(cfgIssues.find({'repo.id': RepoObj.id, 'refreshed': true}).count(), data.data.viewer.organization.repository.issues.totalCount);
            console.log('Loading issues for repo:  ' + RepoObj.name + 'Query Increment: ' + queryIncrement);
            if (queryIncrement > 0) {
                await this.getIssuesPagination(lastCursor, queryIncrement, RepoObj);
            }
        }
    };

    ingestIssues = async (data) => {
        let lastCursor = null;
        console.log(data.data.viewer.organization.repository);

        for (let [key, currentIssue] of Object.entries(data.data.viewer.organization.repository.issues.edges)){
            console.log('Loading issue: ' + currentIssue.node.title);
            let existNode = cfgIssues.findOne({id: currentIssue.node.id});

            let nodePinned = false;
            let nodePoints = null;
            if (existNode !== undefined) {
                nodePinned = existNode.pinned;
                nodePoints = existNode.points;
            }

            let issueObj = {
                id: currentIssue.node.id,
                title: currentIssue.node.title,
                url: currentIssue.node.url,
                author: currentIssue.node.author,
                org: {
                    'login': data.data.viewer.organization.login,
                    'id': data.data.viewer.organization.id,
                    'name': data.data.viewer.organization.name,
                    'url': data.data.viewer.organization.url
                },
                repo: {
                    'name': data.data.viewer.organization.repository.name,
                    'databaseId': data.data.viewer.organization.repository.databaseId,
                    'id': data.data.viewer.organization.repository.id,
                    'url': data.data.viewer.organization.repository.url
                },
                labels: currentIssue.node.labels,
                repo_id: data.data.viewer.organization.repository.id,
                state: currentIssue.node.state,
                milestone: currentIssue.node.milestone,
                assignees: currentIssue.node.assignees,
                createdAt: currentIssue.node.createdAt,
                updatedAt: currentIssue.node.updatedAt,
                closedAt: currentIssue.node.closedAt,
                stats: getIssuesStats(currentIssue.node.createdAt, currentIssue.node.updatedAt, currentIssue.node.closedAt),
                comments: currentIssue.node.comments,
                participants: currentIssue.node.participants,
                databaseId: currentIssue.node.databaseId,
                number: currentIssue.node.number,
                refreshed: true,
                pinned: nodePinned,
                points: nodePoints,
            };
            await cfgIssues.upsert({
                id: issueObj.id
            }, {
                $set: issueObj
            });
            this.props.incrementIssuesLoadedCount(1);
            //console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name);
            lastCursor = currentIssue.cursor
        }
        return lastCursor;
    };

    getLabelsPagination = async (cursor, increment, RepoObj) => {
        const { client } = this.props;
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
    };

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
                org: {
                    'login': data.data.viewer.organization.login,
                    'id': data.data.viewer.organization.id,
                    'name': data.data.viewer.organization.name,
                    'url': data.data.viewer.organization.url
                },
                repo: {
                    'name': data.data.viewer.organization.repository.name,
                    'databaseId': data.data.viewer.organization.repository.databaseId,
                    'id': data.data.viewer.organization.repository.id,
                    'url': data.data.viewer.organization.repository.url
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
            this.props.incrementLabelsLoadedCount(1);
            //console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name);
            lastCursor = currentLabel.cursor
        }
        return lastCursor;
    };

    render() {
        return null;
    }
}

Repos.propTypes = {

};

const mapState = state => ({
    issuesLoading: state.githubIssues.loading,
    issuesLoadFlag: state.githubIssues.loadFlag,

    labelsLoading: state.githubLabels.loading,
    labelsLoadFlag: state.githubLabels.loadFlag,
});

const mapDispatch = dispatch => ({
    setIssuesLoading: dispatch.githubIssues.setLoading,
    setIssuesLoadFlag: dispatch.githubIssues.setLoadFlag,
    setIssuesTotalCount: dispatch.githubIssues.setTotalCount,
    setIssuesLoadedCount: dispatch.githubIssues.setLoadedCount,
    setIssuesLoadedCountBuffer: dispatch.githubIssues.setLoadedCountBuffer,
    incrementIssuesLoadedCount: dispatch.githubIssues.incrementLoadedCount,
    incrementIssuesLoadedCountBuffer: dispatch.githubIssues.incrementLoadedCountBuffer,

    setLabelsLoading: dispatch.githubLabels.setLoading,
    setLabelsLoadFlag: dispatch.githubLabels.setLoadFlag,
    setLabelsTotalCount: dispatch.githubLabels.setTotalCount,
    setLabelsLoadedCount: dispatch.githubLabels.setLoadedCount,
    setLabelsLoadedCountBuffer: dispatch.githubLabels.setLoadedCountBuffer,
    incrementLabelsLoadedCount: dispatch.githubLabels.incrementLoadedCount,
    incrementLabelsLoadedCountBuffer: dispatch.githubLabels.incrementLoadedCountBuffer,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Repos));

