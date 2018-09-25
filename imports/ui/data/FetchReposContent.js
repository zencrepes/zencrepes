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
        this.errorRetry = 0;
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
        const {
            setLoading,
            incrementIssuesLoadedCountBuffer,
            setIssuesTotalCount,
            setLabelsTotalCount,
            setLoadSuccess,
            incrementLabelsLoadedCountBuffer,
            loadRepos,
            setLoadRepos} = this.props;

        await setLoading(true);  // Set to true to indicate issues are actually loading.
        //await cfgIssues.update({}, { $set: { active: false } }, {multi: true}); // Set all issues inactive, at the end of the process, all inactive issues will be deleted

        console.log(this.loadIssues);
        console.log(this.loadLabels);

        //Check if there if we are loading everything or just data for a subset of repositories
        let reposQuery = {};
        if (loadRepos.length > 0) {
            reposQuery = {"id":{"$in":loadRepos}}
        }

        //First action is to calculate the number of expected issues and labels to be loaded
        let issuesTotalCount = cfgSources.find({active: true}).fetch()
            .map(repo => repo.issues.totalCount)
            .reduce((acc, count) => acc + count, 0);
        setIssuesTotalCount(issuesTotalCount);

        let labelsTotalCount = cfgSources.find({active: true}).fetch()
            .map(repo => repo.labels.totalCount)
            .reduce((acc, count) => acc + count, 0);
        setLabelsTotalCount(labelsTotalCount);

        for (let repo of cfgSources.find(reposQuery).fetch()) {
            if (repo.active === false) {
                //If repo is inactive, delete any issues attached to this repo (if any)
                console.log('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + cfgIssues.find({'repo.id': repo.id}).count() + ' issues and ' + cfgLabels.find({'repo.id': repo.id}).count() + ' labels');
                await cfgIssues.remove({'repo.id': repo.id});
                await cfgLabels.remove({'repo.id': repo.id});
            } else if (repo.active === true) {
                console.log('Processing repo: ' + repo.name + ' - Is active, should have ' + repo.issues.totalCount + ' issues and ' + repo.labels.totalCount + ' labels');

                if (this.loadIssues) {
                    // We always start by loading 5 issues in the repository
                    // This is also used to refresh the total number of issues & labels in the repo, which might have
                    // changed since last data load.
                    // In the reload there is a need to take in consideration the sitatution where an issue is created during load
                    // and find how to prevent an infinite loop. Might be sufficient to based on the following query after last cursor
                    // TODO - Need to refresh issues content as well, so need to bring last updated date in the logic
                    await this.getIssuesPagination(null, 5, repo);
                }
                if (this.loadLabels) {
                    await cfgLabels.remove({'repo.id': repo.id});
                    let loadLabelsIncrement = 15;
                    if (repo.labels.totalCount > 0 && repo.labels.totalCount <= 100) {
                        loadLabelsIncrement = repo.labels.totalCount;
                    }
                    await this.getLabelsPagination(null, loadLabelsIncrement, repo);
                }


                /*
                //If repo is active, load all issues attached to this repo (if any)
                if (repo.issues.totalCount > 0 && this.loadIssues) {
                    //First, marked all existing issues are non-refreshed
                    let updatedDocs = cfgIssues.update({'repo.id': repo.id}, {$set: {'refreshed': false}});

                    //Increment the issues buffer, used for showing a progress bar buffer value
                    incrementIssuesLoadedCountBuffer(repo.issues.totalCount);

                    //Load as many issues as possible
                    let queryIncrement = 100;
                    // Check if repo already have issues loaded, if yes, only start by loading 10 as first query increment
                    // This helps saving on query speed on frequent reload
                    if (cfgIssues.find({'repo.id': repo.id}).count() > 0) {
                        queryIncrement = 10;
                    } else if (repo.issues.totalCount < 100) {
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
                    //First, delete all labels since we'll be refreshing everything
                    //let updatedDocs = cfgLabels.update({'repo.id': repo.id}, {$set: {'refreshed': false}});
                    await cfgLabels.remove({'repo.id': repo.id});

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
                */
            }
        }

        console.log('Will be deleting ' + cfgIssues.find({active: false}).count() + ' issues attached to disabled repositories');
        await cfgIssues.remove({active: false});

        console.log('Load completed: There is a total of ' + cfgIssues.find({}).count() + ' issues and ' + cfgLabels.find({}).count() + ' labels in memory');
        setLoading(false);  // Set to true to indicate issues are done loading.
        setLoadSuccess(true);
        setLoadRepos([]);// Reset load repos
    };

    getIssuesPagination = async (cursor, increment, repoObj) => {
        const { client, setLoadSuccess } = this.props;
        if (this.props.loading) {
            if (this.errorRetry <= 3) {
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_ISSUES,
                        variables: {repo_cursor: cursor, increment: increment, org_name: repoObj.org.login, repo_name: repoObj.name},
                        fetchPolicy: 'no-cache',
                        errorPolicy: 'ignore',
                    });
                    console.log(data);
                }
                catch (error) {
                    console.log(error);
                }
                console.log(repoObj);
                if (data.data !== null) {
                    this.errorRetry = 0;
                    this.props.updateChip(data.data.rateLimit);
                    // Check if the repository actually exist and issues were returned
                    if (data.data.repository !== null && data.data.repository.issues.edges.length > 0) {
                        //data.data.repository.issues.totalCount;
                        // Refresh the repository with the updated issues count
                        let updatedRepo = cfgSources.update({'id': repoObj.id}, {$set: {'issues.totalCount': data.data.repository.issues.totalCount}});

                        let lastCursor = await this.ingestIssues(data, repoObj);
                        let loadedIssuesCount = cfgIssues.find({'repo.id': repoObj.id, 'refreshed': true}).count();
                        let queryIncrement = calculateQueryIncrement(loadedIssuesCount, data.data.repository.issues.totalCount);
                        console.log('Loading issues for repo:  ' + repoObj.name + ' - Query Increment: ' + queryIncrement + ' - Local Count: ' + loadedIssuesCount + ' - Remote Count: ' + data.data.repository.issues.totalCount);
                        if (queryIncrement > 0 && lastCursor !== null) {
                            //Start recurring call, to load all issues from a repository
                            await this.getIssuesPagination(lastCursor, queryIncrement, repoObj);
                        }
                    }
                } else {
                    this.errorRetry = this.errorRetry + 1;
                    console.log('Error loading content, current count: ' + this.errorRetry)
                    await this.getIssuesPagination(cursor, increment, repoObj);
                }
            } else {
                console.log('Got too many load errors, stopping');
                setLoadSuccess(false);
                setLoading(false);
            }
        }
    };

    /*
    getIssuesPagination = async (cursor, increment, repoObj, lastUpdateDate) => {
        const { client, setLoadSuccess } = this.props;
        if (this.props.loading) {
            if (this.errorRetry <= 3) {
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_ISSUES,
                        variables: {repo_cursor: cursor, increment: increment, org_name: repoObj.org.login, repo_name: repoObj.name},
                        fetchPolicy: 'no-cache',
                        errorPolicy: 'ignore',
                    });
                    console.log(data);
                }
                catch (error) {
                    console.log(error);
                }
                console.log(data);
                console.log(repoObj);
                if (data.data !== null) {
                    this.errorRetry = 0;
                    this.props.updateChip(data.data.rateLimit);
                    if (data.data.repository !== null) {
                        let lastCursor = await this.ingestIssues(data, repoObj, lastUpdateDate);
                        let queryIncrement = calculateQueryIncrement(cfgIssues.find({'repo.id': repoObj.id, 'refreshed': true}).count(), data.data.repository.issues.totalCount);
                        console.log('Loading issues for repo:  ' + repoObj.name + ' - Query Increment: ' + queryIncrement);
                        if (queryIncrement > 0 && lastCursor !== null) {
                            await this.getIssuesPagination(lastCursor, queryIncrement, repoObj, lastUpdateDate);
                        }
                    }
                } else {
                    this.errorRetry = this.errorRetry + 1;
                    console.log('Error loading content, current count: ' + this.errorRetry)
                    await this.getIssuesPagination(cursor, increment, repoObj, lastUpdateDate);
                }
            } else {
                console.log('Got too many load errors, stopping');
                setLoadSuccess(false);
                setLoading(false);
            }
        }
    };
    */

    ingestIssues = async (data, repoObj) => {
        let lastCursor = null;
        let stopLoad = false;
        console.log(data);
        for (let [key, currentIssue] of Object.entries(data.data.repository.issues.edges)){
            console.log('Loading issue: ' + currentIssue.node.title);
            let existNode = cfgIssues.findOne({id: currentIssue.node.id});
            console.log(existNode);
            console.log(currentIssue.node.updatedAt);
            console.log(new Date(currentIssue.node.updatedAt).getTime());
            console.log(new Date(existNode.updatedAt).getTime());
            let exitsNodeUpdateAt = null;
            if (existNode !== undefined) {
                exitsNodeUpdateAt = existNode.updatedAt;
            }
            if (new Date(currentIssue.node.updatedAt).getTime() === new Date(exitsNodeUpdateAt).getTime()) {
                console.log('Issue already loaded, skipping');
                console.log(data.data.repository.issues.totalCount);
                console.log(cfgIssues.find({'repo.id': repoObj.id}).count());

                // Issues are loaded from newest to oldest, when it gets to a point where updated date of a loaded issue
                // is equal to updated date of a local issue, it means there is no "new" content, but there might still be
                // issues that were not loaded for any reason. So the system only stops loaded if totalCount remote is equal
                //  to the total number of issues locally
                if (data.data.repository.issues.totalCount === cfgIssues.find({'repo.id': repoObj.id}).count()) {
                    stopLoad = true;
                }
            } else {
                console.log('New or updated issue');
                let nodePinned = false;
                let nodePoints = null;
                if (existNode !== undefined) {
                    nodePinned = existNode.pinned;
                    nodePoints = existNode.points;
                }
                let issueObj = JSON.parse(JSON.stringify(currentIssue.node)); //TODO - Replace this with something better to copy object ?
                issueObj['repo'] = repoObj;
                issueObj['org'] = repoObj.org;
                issueObj['stats'] = getIssuesStats(currentIssue.node.createdAt, currentIssue.node.updatedAt, currentIssue.node.closedAt);
                issueObj['refreshed'] = true;
                issueObj['pinned'] = nodePinned;
                issueObj['points'] = nodePoints;
                issueObj['active'] = true;

                if (issueObj.labels !== undefined) {
                    //Get points from labels
                    // Regex to test: SP:[.\d]
                    let pointsExp = RegExp('SP:[.\\d]');
                    for (let [key, currentLabel] of Object.entries(issueObj.labels.edges)) {
                        if (pointsExp.test(currentLabel.node.name)) {
                            let points = parseInt(currentLabel.node.name.replace('SP:', ''));
                            console.log('This issue has ' + points + ' story points');
                            issueObj['points'] = points;
                        }
                    }
                }
                await cfgIssues.upsert({
                    id: issueObj.id
                }, {
                    $set: issueObj
                });
                this.props.incrementIssuesLoadedCount(1);
            }
            lastCursor = currentIssue.cursor;
        }
        if (lastCursor === null) {
            console.log('=> No more updates to load, will not be making another GraphQL call for this repository');
        }
        if (stopLoad === true) {
            lastCursor = null;
        }
        return lastCursor;
    };

    getLabelsPagination = async (cursor, increment, repoObj) => {
        const { client } = this.props;
        if (this.props.loading) {
            let data = await client.query({
                query: GET_GITHUB_LABELS,
                variables: {
                    repo_cursor: cursor,
                    increment: increment,
                    org_name: repoObj.org.login,
                    repo_name: repoObj.name
                },
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            });
            this.props.updateChip(data.data.rateLimit);
            console.log(data);
            if (data.data.repository !== null) {
                let updatedRepo = cfgSources.update({'id': repoObj.id}, {$set: {'labels.totalCount': data.data.repository.labels.totalCount}});

                let lastCursor = await this.ingestLabels(data, repoObj);
                console.log(data.data.repository);
                let loadedLabelsCount = cfgLabels.find({'repo.id': repoObj.id, 'refreshed': true}).count();

                let queryIncrement = calculateQueryIncrement(loadedLabelsCount, data.data.repository.labels.totalCount);
                console.log('Loading data for repo:  ' + repoObj.name + ' - Query Increment: ' + queryIncrement + ' - Local Count: ' + loadedLabelsCount + ' - Remote Count: ' + data.data.repository.labels.totalCount);

                if (queryIncrement > 0) {
                    await this.getLabelsPagination(lastCursor, queryIncrement, repoObj);
                }
            }
        }
    };

    ingestLabels = async (data, repoObj) => {
        let lastCursor = null;
        console.log(data.data.repository);

        for (let [key, currentLabel] of Object.entries(data.data.repository.labels.edges)){
            console.log('Loading label: ' + currentLabel.node.name);
            //let existNode = cfgLabels.findOne({id: currentLabel.node.id});

            let labelObj = JSON.parse(JSON.stringify(currentLabel.node)); //TODO - Replace this with something better to copy object ?
            labelObj['repo'] = repoObj;
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

    loadRepos: state.githubFetchReposContent.loadRepos,

});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubFetchReposContent.setLoadFlag,
    setLoading: dispatch.githubFetchReposContent.setLoading,
    setLoadSuccess: dispatch.githubFetchReposContent.setLoadSuccess,
    setLoadRepos: dispatch.githubFetchReposContent.setLoadRepos,

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