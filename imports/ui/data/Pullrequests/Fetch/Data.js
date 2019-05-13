import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_ISSUES from '../../../../graphql/getPullrequests.graphql';

import { cfgSources } from '../../Minimongo.js';
import { cfgPullrequests } from '../../Minimongo.js';

import calculateQueryIncrement from '../../utils/calculateQueryIncrement.js';
import ingestPullrequest from '../../utils/ingestPullrequest.js';
import { cfgLabels } from "../../Minimongo";

import {reactLocalStorage} from 'reactjs-localstorage';

class Data extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.errorRetry = 0;
        this.pullrequestsCount = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setLoadFlag, loadFlag, loading } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (loadFlag === true && prevProps.loadFlag === false && loading === false) {
            setLoadFlag(false);
            this.load();
        }
    };

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    load = async () => {
        const {
            setLoading,
            setLoadingMsgAlt,
            setLoadingIterateTotal,
            incLoadingIterateCurrent,
            setLoadingIterateCurrent,
            setLoadingSuccessMsg,
            setLoadingSuccess,
            loadRepos,
            log,
            onSuccess,
        } = this.props;

        //Check if there if we are loading everything or just data for a subset of repositories
        let reposQuery = {};
        if (loadRepos.length > 0) {
            reposQuery = {"id":{"$in":loadRepos}}
        }

        let scanRepos = cfgSources.find(reposQuery).fetch();

        setLoading(true);
        setLoadingIterateTotal(scanRepos.filter(repo => repo.active === true).length);
        setLoadingIterateCurrent(0);
        await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading

        for (let repo of cfgSources.find(reposQuery).fetch()) {
            if (repo.active === false) {
                //If repo is inactive, delete any pullrequests attached to this repo (if any)
                log.info('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + cfgPullrequests.find({'repo.id': repo.id}).count() + ' pullrequests and ' + cfgLabels.find({'repo.id': repo.id}).count() + ' labels');
                await cfgPullrequests.remove({'repo.id': repo.id});
            } else if (repo.active === true) {
                log.info('Processing repo: ' + repo.name + ' - Is active, should have ' + repo.pullRequests.totalCount + ' pullrequests and ' + repo.labels.totalCount + ' labels');
                setLoadingMsgAlt('Fetching pullrequests from ' + repo.org.login + '/' + repo.name);

                // We always start by loading 5 pullrequests in the repository
                // This is also used to refresh the total number of pullrequests & labels in the repo, which might have
                // changed since last data load.
                // In the reload there is a need to take in consideration the sitatution where an pullrequest is created during load
                // and find how to prevent an infinite loop. Might be sufficient to based on the following query after last cursor
                // TODO - Need to refresh pullrequests content as well, so need to bring last updated date in the logic
                await this.getPullrequestsPagination(null, 5, repo);
                incLoadingIterateCurrent(1);
                setLoadingSuccessMsg('Fetched ' + this.pullrequestsCount + ' milestones');

            }
        }

        log.info('Load completed: There is a total of ' + cfgPullrequests.find({}).count() + ' pullrequests in memory');
        setLoadingSuccess(true);
        setLoading(false);  // Set to true to indicate pullrequests are done loading.
        this.pullrequestsCount = 0;
        onSuccess();
    };

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    // TODO- There is a big pullrequest with the way the query increment is calculated, if remote has 100 pullrequests, but local only has 99
    // Query increment should not be just 1 since if the missing pullrequest is far down, this will generate a large number of calls
    getPullrequestsPagination = async (cursor, increment, repoObj) => {
        const { client, setLoading, log } = this.props;
        if (this.props.loading) {
            if (this.errorRetry <= 3) {
                let data = {};
                try {
                    await this.sleep(1000); // Wait 2s between requests to avoid hitting GitHub API rate limit => https://developer.github.com/v3/guides/best-practices-for-integrators/
                    data = await client.query({
                        query: GET_GITHUB_ISSUES,
                        variables: {repo_cursor: cursor, increment: increment, org_name: repoObj.org.login, repo_name: repoObj.name},
                        fetchPolicy: 'no-cache',
                        errorPolicy: 'ignore',
                    });
                    log.info(data);
                }
                catch (error) {
                    log.info(error);
                }
                log.info(repoObj);
                if (data.data !== null && data.data !== undefined) {
                    this.errorRetry = 0;
                    this.props.updateChip(data.data.rateLimit);
                    // Check if the repository actually exist and pullrequests were returned
                    if (data.data.repository !== null && data.data.repository.pullRequests.edges.length > 0) {
                        //data.data.repository.pullRequests.totalCount;
                        // Refresh the repository with the updated pullRequests count
                        cfgSources.update({'id': repoObj.id}, {$set: {'pullRequests.totalCount': data.data.repository.pullRequests.totalCount}});

                        let lastCursor = await this.ingestPullrequests(data, repoObj);
                        let loadedPullrequestsCount = cfgPullrequests.find({'repo.id': repoObj.id, 'refreshed': true}).count();
                        let queryIncrement = calculateQueryIncrement(loadedPullrequestsCount, data.data.repository.pullRequests.totalCount);
                        log.info('Loading pullRequests for repo:  ' + repoObj.name + ' - Query Increment: ' + queryIncrement + ' - Local Count: ' + loadedPullrequestsCount + ' - Remote Count: ' + data.data.repository.pullRequests.totalCount);
                        if (queryIncrement > 0 && lastCursor !== null) {
                            //Start recurring call, to load all pullRequests from a repository
                            await this.getPullrequestsPagination(lastCursor, queryIncrement, repoObj);
                        }
                    }
                } else {
                    this.errorRetry = this.errorRetry + 1;
                    log.info('Error loading content, current count: ' + this.errorRetry)
                    await this.getPullrequestsPagination(cursor, increment, repoObj);
                }
            } else {
                log.info('Got too many load errors, stopping');
                setLoading(false);
            }
        }
    };

    ingestPullrequests = async (data, repoObj) => {
        const { setLoadingMsg, log } = this.props;

        let lastCursor = null;
        let stopLoad = false;

        var moment = require('moment');
        //let loadHistoryDate = moment(new Date());
        const loadHistoryDate = moment(new Date()).subtract(reactLocalStorage.get('issuesHistoryLoad', 3), 'months');

        log.info(data);
        for (var currentPullrequest of data.data.repository.pullRequests.edges){
            log.info(currentPullrequest);
            log.info('Loading pullrequest: ' + currentPullrequest.node.title);
            let existNode = cfgPullrequests.findOne({id: currentPullrequest.node.id});
//            log.info(existNode);
//            log.info(currentPullrequest.node.updatedAt);
//            log.info(new Date(currentPullrequest.node.updatedAt).getTime());
            let exitsNodeUpdateAt = null;
            if (existNode !== undefined) {
                exitsNodeUpdateAt = existNode.updatedAt;
//                log.info(new Date(existNode.updatedAt).getTime());
            }
            if (new Date(currentPullrequest.node.updatedAt).getTime() === new Date(exitsNodeUpdateAt).getTime()) {
                log.info('Pullrequest already loaded, stopping entire load');
//                log.info(data.data.repository.pullrequests.totalCount);
//                log.info(cfgPullrequests.find({'repo.id': repoObj.id}).count());

                // Pullrequests are loaded from newest to oldest, when it gets to a point where updated date of a loaded pullrequest
                // is equal to updated date of a local pullrequest, it means there is no "new" content, but there might still be
                // pullrequests that were not loaded for any reason. So the system only stops loaded if totalCount remote is equal
                //  to the total number of pullrequests locally
                // Note Mar 21: This logic might be fine when the number of pullrequests is relatively small, definitely problematic for large repositories.
                // Commenting it out for now, it will not keep looking in the past if load is interrupted for some reason.
                //if (data.data.repository.pullrequests.totalCount === cfgPullrequests.find({'repo.id': repoObj.id}).count()) {
                //    stopLoad = true;
                //}
                stopLoad = true;
            } else if (new Date(currentPullrequest.node.updatedAt).getTime() < loadHistoryDate.valueOf()) {
                stopLoad = true;
                // Need to add logic to limit how far back pullrequests will be loaded by letting the user define a number of months
                // To keep the logic simple, loading pullrequests that were updated during the past X Months
                //  - Note: GraphQL PullrequestOrder Field only works for CREATED_AT, UPDATED_AT & COMMENTS. The doc doesn't list CLOSED_AT as a possible sort field.
            } else {
                log.info('New or updated pullrequest');

                const updatedPullrequest = await ingestPullrequest(cfgPullrequests, currentPullrequest.node, repoObj, repoObj.org);
                if (updatedPullrequest.points !== null) {
                    log.info('This pullrequest has ' + updatedPullrequest.points + ' story points');
                }
                if (updatedPullrequest.boardState !== null) {
                    log.info('This pullrequest is in Agile State ' + updatedPullrequest.boardState.name);
                }
                /*
                let pullrequestObj = JSON.parse(JSON.stringify(currentPullrequest.node)); //TODO - Replace this with something better to copy object ?
                pullrequestObj['repo'] = repoObj;
                pullrequestObj['org'] = repoObj.org;
                pullrequestObj['stats'] = getPullrequestsStats(currentPullrequest.node.createdAt, currentPullrequest.node.updatedAt, currentPullrequest.node.closedAt);
                pullrequestObj['refreshed'] = true;
                pullrequestObj['points'] = null;
                pullrequestObj['active'] = true;

                if (pullrequestObj.labels !== undefined) {
                    //Get points from labels
                    // Regex to test: SP:[.\d]
                    let pointsExp = RegExp('SP:[.\\d]');
                    let boardExp = RegExp('(AB):([.\\d]):(.+)');
                    for (var currentLabel of pullrequestObj.labels.edges) {
                        if (pointsExp.test(currentLabel.node.name)) {
                            let points = parseInt(currentLabel.node.name.replace('SP:', ''));
                            log.info('This pullrequest has ' + points + ' story points');
                            pullrequestObj['points'] = points;
                        }
                        console.log(currentLabel.node.description);
                        console.log(boardExp.test(currentLabel.node.description));
                    }
                }
                await cfgPullrequests.remove({'id': pullrequestObj.id});
                await cfgPullrequests.upsert({
                    id: pullrequestObj.id
                }, {
                    $set: pullrequestObj
                });
                */
                this.pullrequestsCount = this.pullrequestsCount + 1;
                setLoadingMsg(this.pullrequestsCount + ' pullrequests loaded');
                /*
                if (pullrequestObj.milestone !== null) {
                    let milestoneObj = pullrequestObj.milestone;
                    milestoneObj['repo'] = repoObj;
                    milestoneObj['org'] = repoObj.org;
                    await cfgMilestones.upsert({
                        id: milestoneObj.id
                    }, {
                        $set: milestoneObj
                    });
                }
                */
            }
            lastCursor = currentPullrequest.cursor;
        }

        if (lastCursor === null) {
            log.info('=> No more updates to load, will not be making another GraphQL call for this repository');
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
    loadFlag: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    loadRepos: PropTypes.array,

    setLoadFlag: PropTypes.func.isRequired,

    log: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,

    setLoading: PropTypes.func.isRequired,
    setLoadingMsg: PropTypes.func.isRequired,
    setLoadingMsgAlt: PropTypes.func.isRequired,
    setLoadingModal: PropTypes.func.isRequired,
    setLoadingIterateCurrent: PropTypes.func.isRequired,
    incLoadingIterateCurrent: PropTypes.func.isRequired,
    setLoadingIterateTotal: PropTypes.func.isRequired,
    setLoadingSuccess: PropTypes.func.isRequired,
    setLoadingSuccessMsg: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,

    updateChip: PropTypes.func.isRequired,
};

const mapState = state => ({
    loadFlag: state.pullrequestsFetch.loadFlag,
    loadRepos: state.pullrequestsFetch.loadRepos,

    log: state.global.log,

    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.pullrequestsFetch.setLoadFlag,

    setLoading: dispatch.loading.setLoading,
    setLoadingMsg: dispatch.loading.setLoadingMsg,
    setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
    setLoadingModal: dispatch.loading.setLoadingModal,
    setLoadingIterateCurrent: dispatch.loading.setLoadingIterateCurrent,
    incLoadingIterateCurrent: dispatch.loading.incLoadingIterateCurrent,
    setLoadingIterateTotal: dispatch.loading.setLoadingIterateTotal,
    setLoadingSuccess: dispatch.loading.setLoadingSuccess,
    setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Data));