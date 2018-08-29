import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_ISSUES from '../../graphql/getIssues.graphql';
import GET_GITHUB_LABELS from '../../graphql/getLabels.graphql';

import { cfgIssues } from './Minimongo.js';
import { cfgLabels } from './Minimongo.js';
import { cfgSources } from './Minimongo.js';

import calculateQueryIncrement from './calculateQueryIncrement.js';
import getIssuesStats from './getIssuesStats.js';

class FetchReposContent extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.loadIssues = false;
        this.loadLabels = false;
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { setLoadFlag, loadFlag, loading} = this.props;
        console.log(loadFlag);
        if (loadFlag !== false && loading === false) {
            if (loadFlag['issues'] === 'true') {
                console.log('loading issues');
                this.loadIssues = true;
                this.resetIssuesCounts();
            } else {this.loadIssues = false;}

            if (loadFlag['labels'] === 'true') {
                this.loadLabels = true;
                this.resetLabelsCounts();
            } else {this.loadLabels = false;}

            setLoadFlag(false);

            console.log(this.loadIssues);
            console.log(this.loadLabels);

            this.loadReposContent();
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
        const { setLoading, incrementIssuesLoadedCountBuffer, setIssuesTotalCount, setLabelsTotalCount, setLoadSuccess, incrementLabelsLoadedCountBuffer} = this.props;
        await setLoading(true);  // Set to true to indicate issues are actually loading.
        await cfgIssues.update({}, { $set: { active: false } }, {multi: true}); // Set all issues inactive, at the end of the process, all inactive issues will be deleted

        console.log(this.loadIssues);
        console.log(this.loadLabels);

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
            if (repo.active === false && (cfgIssues.find({'repo.id': repo.id}).count() > 0 || cfgLabels.find({'repo.id': repo.id}).count() > 0)) {
                //If repo is inactive, delete any issues attached to this repo (if any)
                //let attachedIssues = cfgIssues.find({'repo.id': repo.id}).count();
                console.log('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + cfgIssues.find({'repo.id': repo.id}).count() + ' issues and ' + cfgLabels.find({'repo.id': repo.id}).count() + ' labels');
                //console.log(cfgIssues.find({'repo.id': repo.id}).fetch());
                await cfgIssues.remove({'repo.id': repo.id});
                await cfgLabels.remove({'repo.id': repo.id});
            } else if (repo.active === true) {
                console.log('Processing repo: ' + repo.name + ' - Is active, has ' + repo.issues.totalCount + ' issues and ' + repo.labels.totalCount + ' labels');

                //If repo is active, load all issues attached to this repo (if any)
                if (repo.issues.totalCount > 0 && this.loadIssues) {
                    //First, marked all existing issues are non-refreshed
                    let updatedDocs = cfgIssues.update({'repo.id': repo.id}, {$set: {'refreshed': false}});

                    //Increment the issues buffer, used for showing a progress bar buffer value
                    incrementIssuesLoadedCountBuffer(repo.issues.totalCount);

                    //Load as many issues as possible
                    let queryIncrement = 100;
                    if (repo.issues.totalCount < 100) {
                        queryIncrement = repo.issues.totalCount;
                    }
                    console.log('Importing issues from: ' + repo.name + ' - Query increment: ' + queryIncrement);
                    //window.issues.findOne({}, {sort: {updatedAt: -1}});
                    let lastUpdatedIssue = cfgIssues.findOne({'repo.id': repo.id}, {sort: {updatedAt: -1}});
                    let lastUpdateDate = '1990-12-12T00:00:00Z';
                    if (lastUpdatedIssue !== undefined) {
                        lastUpdateDate = lastUpdatedIssue.updatedAt;
                        console.log('Will load issues updated more recently than: ' + lastUpdatedIssue.updatedAt);
                    }
                    await this.getIssuesPagination(null, queryIncrement, repo, lastUpdateDate);
                    await cfgIssues.update({'repo.id': repo.id}, {$set: {'active': true}});

                }
                if (repo.labels.totalCount > 0 && this.loadLabels) {
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
                    await this.getLabelsPagination(null, queryIncrement, repo);

                }
            }
        }
        console.log('Will be deleting ' + cfgIssues.find({active: false}).count() + ' attached to disabled repositories');
        await cfgIssues.remove({active: false});

        console.log('Load completed: There is a total of ' + cfgIssues.find({}).count() + ' issues and ' + cfgLabels.find({}).count() + ' labels in memory');
        setLoading(false);  // Set to true to indicate issues are done loading.
        setLoadSuccess(true);
    };

    getIssuesPagination = async (cursor, increment, RepoObj, lastUpdateDate) => {
        const { client } = this.props;
        if (this.props.loading) {
            let data = await client.query({
                query: GET_GITHUB_ISSUES,
                variables: {repo_cursor: cursor, increment: increment, org_name: RepoObj.org.login, repo_name: RepoObj.name},
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            });
            console.log(data);
            console.log(RepoObj);
            this.props.updateChip(data.data.rateLimit);
            if (data.data.repository !== null) {
                let lastCursor = await this.ingestIssues(data, RepoObj, lastUpdateDate);
                let queryIncrement = calculateQueryIncrement(cfgIssues.find({'repo.id': RepoObj.id, 'refreshed': true}).count(), data.data.repository.issues.totalCount);
                console.log('Loading issues for repo:  ' + RepoObj.name + ' - Query Increment: ' + queryIncrement);
                if (queryIncrement > 0 && lastCursor !== null) {
                    await this.getIssuesPagination(lastCursor, queryIncrement, RepoObj, lastUpdateDate);
                }
            }
        }
    };

    ingestIssues = async (data, RepoObj, lastUpdateDate) => {
        let lastCursor = null;
        let stopUpdates = false;
        console.log(data);
        console.log(data.data.repository);

        for (let [key, currentIssue] of Object.entries(data.data.repository.issues.edges)){
            console.log('Loading issue: ' + currentIssue.node.title);
            let existNode = cfgIssues.findOne({id: currentIssue.node.id});

            let nodePinned = false;
            let nodePoints = null;
            if (existNode !== undefined) {
                nodePinned = existNode.pinned;
                nodePoints = existNode.points;
            }
            let issueObj = JSON.parse(JSON.stringify(currentIssue.node)); //TODO - Replace this with something better to copy object ?
            issueObj['repo'] = RepoObj;
            issueObj['org'] = RepoObj.org;
            issueObj['stats'] = getIssuesStats(currentIssue.node.createdAt, currentIssue.node.updatedAt, currentIssue.node.closedAt);
            issueObj['refreshed'] = true;
            issueObj['pinned'] = nodePinned;
            issueObj['points'] = nodePoints;
            issueObj['active'] = true;
            await cfgIssues.upsert({
                id: issueObj.id
            }, {
                $set: issueObj
            });
            this.props.incrementIssuesLoadedCount(1);

            if (new Date(currentIssue.node.updatedAt) <= new Date(lastUpdateDate)) {
                lastCursor = null;
                stopUpdates = true;
            } else if (stopUpdates === false) {
                lastCursor = currentIssue.cursor;
            }
        }
        if (lastCursor === null) {
            console.log('=> No more updates to load, will not be making another GraphQL call for this repository');
        }
        return lastCursor;
    };

    getLabelsPagination = async (cursor, increment, RepoObj) => {
        const { client } = this.props;
        if (this.props.loading) {
            let data = await client.query({
                query: GET_GITHUB_LABELS,
                variables: {
                    repo_cursor: cursor,
                    increment: increment,
                    org_name: RepoObj.org.login,
                    repo_name: RepoObj.name
                },
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            });
            this.props.updateChip(data.data.rateLimit);
            console.log(data);
            if (data.data.repository !== null) {
                let lastCursor = await this.ingestLabels(data, RepoObj);
                console.log(data.data.repository);
                let queryIncrement = calculateQueryIncrement(cfgLabels.find({
                    'repo.id': RepoObj.id,
                    'refreshed': true
                }).count(), data.data.repository.labels.totalCount);
                console.log('Loading data for repo:  ' + RepoObj.name + 'Query Increment: ' + queryIncrement);
                if (queryIncrement > 0) {
                    await this.getLabelsPagination(lastCursor, queryIncrement, RepoObj);
                }
            }
        }
    };

    ingestLabels = async (data, RepoObj) => {
        let lastCursor = null;
        console.log(data.data.repository);

        for (let [key, currentLabel] of Object.entries(data.data.repository.labels.edges)){
            console.log('Loading label: ' + currentLabel.node.name);
            //let existNode = cfgLabels.findOne({id: currentLabel.node.id});

            let labelObj = JSON.parse(JSON.stringify(currentLabel.node)); //TODO - Replace this with something better to copy object ?
            labelObj['repo'] = RepoObj;
            labelObj['refreshed'] = true;
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

FetchReposContent.propTypes = {

};

const mapState = state => ({
    loadFlag: state.githubFetchReposContent.loadFlag,
    loading: state.githubFetchReposContent.loading,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchReposContent.setLoadFlag,
    setLoading: dispatch.githubFetchReposContent.setLoading,
    setLoadSuccess: dispatch.githubFetchReposContent.setLoadSuccess,

    updateChip: dispatch.chip.updateChip,

    setIssuesTotalCount: dispatch.githubIssues.setTotalCount,
    setIssuesLoadedCount: dispatch.githubIssues.setLoadedCount,
    setIssuesLoadedCountBuffer: dispatch.githubIssues.setLoadedCountBuffer,
    incrementIssuesLoadedCount: dispatch.githubIssues.incrementLoadedCount,
    incrementIssuesLoadedCountBuffer: dispatch.githubIssues.incrementLoadedCountBuffer,

    setLabelsTotalCount: dispatch.githubLabels.setTotalCount,
    setLabelsLoadedCount: dispatch.githubLabels.setLoadedCount,
    setLabelsLoadedCountBuffer: dispatch.githubLabels.setLoadedCountBuffer,
    incrementLabelsLoadedCount: dispatch.githubLabels.incrementLoadedCount,
    incrementLabelsLoadedCountBuffer: dispatch.githubLabels.incrementLoadedCountBuffer,
});

export default connect(mapState, mapDispatch)(withApollo(FetchReposContent));