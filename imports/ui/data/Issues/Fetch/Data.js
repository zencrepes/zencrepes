import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_ISSUES from '../../../../graphql/getIssues.graphql';

import { cfgSources } from '../../Minimongo.js';
import { cfgIssues } from '../../Minimongo.js';

import calculateQueryIncrement from '../../utils/calculateQueryIncrement.js';
import getIssuesStats from '../../utils/getIssuesStats.js';
import {cfgLabels, cfgMilestones} from "../../Minimongo";


class Data extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.errorRetry = 0;
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { setLoadFlag, loadFlag, loading} = this.props;
        console.log(loadFlag);
        if (loadFlag === true) { // TODO - Need to prevent load() to run in parrallel
            setLoadFlag(false);
            this.load();
        }
    };

    load = async () => {
        const {
            setLoading,
            setLoadSuccess,
            setLoadError,
            setLoadedCount,
            setIterateTotal,
            incIterateCurrent,
            setIterateCurrent,
            loadRepos
        } = this.props;

        /*
        setIterateCurrent(0);
        setLoadedCount(0);
        setLoading(true);  // Set to true to indicate milestones are actually loading.
*/
        //Check if there if we are loading everything or just data for a subset of repositories
        let reposQuery = {};
        if (loadRepos.length > 0) {
            reposQuery = {"id":{"$in":loadRepos}}
        }

        let scanRepos = cfgSources.find(reposQuery).fetch();
        setIterateTotal(scanRepos.filter(repo => repo.active === true).length);

        for (let repo of cfgSources.find(reposQuery).fetch()) {
            if (repo.active === false) {
                //If repo is inactive, delete any issues attached to this repo (if any)
                console.log('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + cfgIssues.find({'repo.id': repo.id}).count() + ' issues and ' + cfgLabels.find({'repo.id': repo.id}).count() + ' labels');
                await cfgIssues.remove({'repo.id': repo.id});
            } else if (repo.active === true) {
                console.log('Processing repo: ' + repo.name + ' - Is active, should have ' + repo.issues.totalCount + ' issues and ' + repo.labels.totalCount + ' labels');

                // We always start by loading 5 issues in the repository
                // This is also used to refresh the total number of issues & labels in the repo, which might have
                // changed since last data load.
                // In the reload there is a need to take in consideration the sitatution where an issue is created during load
                // and find how to prevent an infinite loop. Might be sufficient to based on the following query after last cursor
                // TODO - Need to refresh issues content as well, so need to bring last updated date in the logic
                await this.getIssuesPagination(null, 5, repo);
                incIterateCurrent(1);
            }
        }

        console.log('Load completed: There is a total of ' + cfgIssues.find({}).count() + ' issues in memory');
        setLoading(false);  // Set to true to indicate milestones are done loading.
        setLoadSuccess(true);
    };

    // TODO- There is a big issue with the way the query increment is calculated, if remote has 100 issues, but local only has 99
    // Query increment should not be just 1 since if the missing issue is far down, this will generate a large number of calls
    getIssuesPagination = async (cursor, increment, repoObj) => {
        const { client, setLoadSuccess, setLoading } = this.props;
        console.log(this.props.loading);
        console.log(this.errorRetry);
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

    ingestIssues = async (data, repoObj) => {
        const { incLoadedCount } = this.props;

        let lastCursor = null;
        let stopLoad = false;
        console.log(data);
        for (let [key, currentIssue] of Object.entries(data.data.repository.issues.edges)){
            console.log('Loading issue: ' + currentIssue.node.title);
            let existNode = cfgIssues.findOne({id: currentIssue.node.id});
//            console.log(existNode);
//            console.log(currentIssue.node.updatedAt);
//            console.log(new Date(currentIssue.node.updatedAt).getTime());
            let exitsNodeUpdateAt = null;
            if (existNode !== undefined) {
                exitsNodeUpdateAt = existNode.updatedAt;
//                console.log(new Date(existNode.updatedAt).getTime());
            }
            if (new Date(currentIssue.node.updatedAt).getTime() === new Date(exitsNodeUpdateAt).getTime()) {
                console.log('Issue already loaded, skipping');
//                console.log(data.data.repository.issues.totalCount);
//                console.log(cfgIssues.find({'repo.id': repoObj.id}).count());

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
                await cfgIssues.remove({'id': issueObj.id});
                await cfgIssues.upsert({
                    id: issueObj.id
                }, {
                    $set: issueObj
                });

                if (issueObj.milestone !== null) {
                    let milestoneObj = issueObj.milestone;
                    milestoneObj['repo'] = repoObj;
                    milestoneObj['org'] = repoObj.org;
                    await cfgMilestones.upsert({
                        id: milestoneObj.id
                    }, {
                        $set: milestoneObj
                    });
                }

                incLoadedCount(1);
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

    render() {
        return null;
    }
}

Data.propTypes = {

};

const mapState = state => ({
    loadFlag: state.issuesFetch.loadFlag,
    loading: state.issuesFetch.loading,

    loadRepos: state.issuesFetch.loadRepos,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoading: dispatch.issuesFetch.setLoading,
    setLoadSuccess: dispatch.issuesFetch.setLoadSuccess,
    setLoadedCount: dispatch.issuesFetch.setLoadedCount,

    incLoadedCount: dispatch.issuesFetch.incLoadedCount,
    setIterateTotal: dispatch.issuesFetch.setIterateTotal,
    setIterateCurrent: dispatch.issuesFetch.setIterateCurrent,
    incIterateCurrent: dispatch.issuesFetch.incIterateCurrent,

    updateChip: dispatch.chip.updateChip,
    updateMilestones: dispatch.milestonesView.updateMilestones,

});

export default connect(mapState, mapDispatch)(withApollo(Data));