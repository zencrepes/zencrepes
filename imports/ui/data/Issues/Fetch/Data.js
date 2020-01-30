import { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';

import GET_GITHUB_ISSUES from '../../../../graphql/getIssues.graphql';

import { cfgSources } from '../../Minimongo.js';
import { cfgIssues } from '../../Minimongo.js';

import calculateQueryIncrement from '../../utils/calculateQueryIncrement.js';
import ingestIssue from '../../utils/ingestIssue.js';
import { cfgLabels } from '../../Minimongo';

import { reactLocalStorage } from 'reactjs-localstorage';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.errorRetry = 0;
    this.issuesCount = 0;
  }

  componentDidUpdate = prevProps => {
    const { setLoadFlag, loadFlag, loading } = this.props;
    // Only trigger load if loadFlag transitioned from false to true
    if (
      loadFlag === true &&
      prevProps.loadFlag === false &&
      loading === false
    ) {
      setLoadFlag(false);
      this.load();
    }
  };

  sleep = ms => {
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
      onSuccess
    } = this.props;

    //Check if there if we are loading everything or just data for a subset of repositories
    let reposQuery = {};
    if (loadRepos.length > 0) {
      reposQuery = { id: { $in: loadRepos } };
    }

    let scanRepos = cfgSources.find(reposQuery).fetch();

    setLoading(true);
    setLoadingIterateTotal(
      scanRepos.filter(repo => repo.active === true).length
    );
    setLoadingIterateCurrent(0);
    await this.sleep(100); // This 100ms sleep allow for change of state for this.props.loading

    for (let repo of cfgSources.find(reposQuery).fetch()) {
      if (repo.active === false) {
        //If repo is inactive, delete any issues attached to this repo (if any)
        log.info(
          'Repo ' +
            repo.name +
            ' (' +
            repo.id +
            ') is inactive, removing: ' +
            cfgIssues.find({ 'repo.id': repo.id }).count() +
            ' issues and ' +
            cfgLabels.find({ 'repo.id': repo.id }).count() +
            ' labels'
        );
        await cfgIssues.remove({ 'repo.id': repo.id });
      } else if (repo.active === true) {
        log.info(
          'Processing repo: ' +
            repo.name +
            ' - Is active, should have ' +
            repo.issues.totalCount +
            ' issues and ' +
            repo.labels.totalCount +
            ' labels'
        );
        setLoadingMsgAlt(
          'Fetching issues from ' + repo.org.login + '/' + repo.name
        );

        // We always start by loading 5 issues in the repository
        // This is also used to refresh the total number of issues & labels in the repo, which might have
        // changed since last data load.
        // In the reload there is a need to take in consideration the sitatution where an issue is created during load
        // and find how to prevent an infinite loop. Might be sufficient to based on the following query after last cursor
        // TODO - Need to refresh issues content as well, so need to bring last updated date in the logic
        await this.getIssuesPagination(null, 5, repo);
        incLoadingIterateCurrent(1);
        setLoadingSuccessMsg('Fetched ' + this.issuesCount + ' issues');
      }
    }

    log.info(
      'Load completed: There is a total of ' +
        cfgIssues.find({}).count() +
        ' issues in memory'
    );
    reactLocalStorage.set('GitHubFetchIssues', new Date().toISOString());
    setLoadingSuccess(true);
    setLoading(false); // Set to true to indicate issues are done loading.
    this.issuesCount = 0;
    onSuccess();
  };

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // TODO- There is a big issue with the way the query increment is calculated, if remote has 100 issues, but local only has 99
  // Query increment should not be just 1 since if the missing issue is far down, this will generate a large number of calls
  getIssuesPagination = async (cursor, increment, repoObj) => {
    const { client, setLoading, log } = this.props;
    if (this.props.loading) {
      if (this.errorRetry <= 3) {
        let data = {};
        const t0 = performance.now();
        try {
          await this.sleep(1000); // Wait 2s between requests to avoid hitting GitHub API rate limit => https://developer.github.com/v3/guides/best-practices-for-integrators/
          data = await client.query({
            query: GET_GITHUB_ISSUES,
            variables: {
              repo_cursor: cursor,
              increment: increment,
              org_name: repoObj.org.login,
              repo_name: repoObj.name
            },
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore'
          });
          log.info(data);
        } catch (error) {
          log.info(error);
        }
        const t1 = performance.now();
        const callDuration = t1 - t0;
        log.info(repoObj);
        if (data.data !== null && data.data !== undefined) {
          this.errorRetry = 0;
          this.props.updateChip(data.data.rateLimit);
          // Check if the repository actually exist and issues were returned
          if (
            data.data.repository !== null &&
            data.data.repository.issues.edges.length > 0
          ) {
            //data.data.repository.issues.totalCount;
            // Refresh the repository with the updated issues count
            cfgSources.update(
              { id: repoObj.id },
              {
                $set: {
                  'issues.totalCount': data.data.repository.issues.totalCount
                }
              }
            );

            let lastCursor = await this.ingestIssues(
              data,
              repoObj,
              callDuration
            );
            let loadedIssuesCount = cfgIssues
              .find({ 'repo.id': repoObj.id, refreshed: true })
              .count();
            let queryIncrement = calculateQueryIncrement(
              loadedIssuesCount,
              data.data.repository.issues.totalCount
            );
            log.info(
              'Loading issues for repo:  ' +
                repoObj.name +
                ' - Query Increment: ' +
                queryIncrement +
                ' - Local Count: ' +
                loadedIssuesCount +
                ' - Remote Count: ' +
                data.data.repository.issues.totalCount
            );
            if (queryIncrement > 0 && lastCursor !== null) {
              //Start recurring call, to load all issues from a repository
              await this.getIssuesPagination(
                lastCursor,
                queryIncrement,
                repoObj
              );
            }
          }
        } else {
          this.errorRetry = this.errorRetry + 1;
          log.info('Error loading content, current count: ' + this.errorRetry);
          await this.getIssuesPagination(cursor, increment, repoObj);
        }
      } else {
        log.info('Got too many load errors, stopping');
        setLoading(false);
      }
    }
  };

  ingestIssues = async (data, repoObj, callDuration) => {
    const { setLoadingMsg, setLoadingMsgAlt, log } = this.props;

    let lastCursor = null;
    let stopLoad = false;

    var moment = require('moment');
    //let loadHistoryDate = moment(new Date());
    const loadHistoryDate = moment(new Date()).subtract(
      reactLocalStorage.get('issuesHistoryLoad', 3),
      'months'
    );

    if (data.data.repository.issues.edges.length > 0) {
      const apiPerf = Math.round(
        data.data.repository.issues.edges.length / (callDuration / 1000)
      );
      //console.log(callDuration);
      //console.log(data.data.repository.issues.edges.length);
      //console.log(Math.round(data.data.repository.issues.edges.length / (callDuration / 1000) , 1));
      setLoadingMsgAlt(
        'Fetching issues from ' +
          repoObj.org.login +
          '/' +
          repoObj.name +
          ', oldest: ' +
          format(
            parseISO(data.data.repository.issues.edges[0].node.updatedAt),
            'LLL do yyyy'
          ) +
          ' (' +
          apiPerf +
          ' issues/s)'
      );
    }

    log.info(data);
    for (var currentIssue of data.data.repository.issues.edges) {
      log.info(currentIssue);
      log.info('Loading issue: ' + currentIssue.node.title);
      let existNode = cfgIssues.findOne({ id: currentIssue.node.id });
      //            log.info(existNode);
      //            log.info(currentIssue.node.updatedAt);
      //            log.info(new Date(currentIssue.node.updatedAt).getTime());
      let exitsNodeUpdateAt = null;
      let issueManualFetch = false;
      if (existNode !== undefined) {
        exitsNodeUpdateAt = existNode.updatedAt;
        if (existNode.manualFetch === true) {
          log.info('This issue was previously manually fetched');
          issueManualFetch = true;
        }
        //                log.info(new Date(existNode.updatedAt).getTime());
      }
      // issueManualFetch is used to identify if the issue has been manually fetched previously (this flag is set in Staging.js).
      // If yes, it does not get taken into account to identify if load should be stopped
      // The idea is to prevent gap in issues updates, if an entire pool hasn't been refreshed for a long time
      // but some issues were frequently manually updated.
      if (
        new Date(currentIssue.node.updatedAt).getTime() ===
          new Date(exitsNodeUpdateAt).getTime() &&
        issueManualFetch === false
      ) {
        log.info('Issue already loaded, stopping entire load');
        //                log.info(data.data.repository.issues.totalCount);
        //                log.info(cfgIssues.find({'repo.id': repoObj.id}).count());

        // Issues are loaded from newest to oldest, when it gets to a point where updated date of a loaded issue
        // is equal to updated date of a local issue, it means there is no "new" content, but there might still be
        // issues that were not loaded for any reason. So the system only stops loaded if totalCount remote is equal
        //  to the total number of issues locally
        // Note Mar 21: This logic might be fine when the number of issues is relatively small, definitely problematic for large repositories.
        // Commenting it out for now, it will not keep looking in the past if load is interrupted for some reason.
        //if (data.data.repository.issues.totalCount === cfgIssues.find({'repo.id': repoObj.id}).count()) {
        //    stopLoad = true;
        //}
        stopLoad = true;
      } else if (
        new Date(currentIssue.node.updatedAt).getTime() <
        loadHistoryDate.valueOf()
      ) {
        stopLoad = true;
        // Need to add logic to limit how far back issues will be loaded by letting the user define a number of months
        // To keep the logic simple, loading issues that were updated during the past X Months
        //  - Note: GraphQL IssueOrder Field only works for CREATED_AT, UPDATED_AT & COMMENTS. The doc doesn't list CLOSED_AT as a possible sort field.
      } else {
        log.info('New or updated issue');

        const updatedIssue = await ingestIssue(
          cfgIssues,
          currentIssue.node,
          repoObj,
          repoObj.org
        );
        if (updatedIssue.points !== null) {
          log.info('This issue has ' + updatedIssue.points + ' story points');
        }
        /*
                if (updatedIssue.boardState !== null) {
                    log.info('This issue is in Agile State ' + updatedIssue.boardState.name);
                }
                */
        /*
                let issueObj = JSON.parse(JSON.stringify(currentIssue.node)); //TODO - Replace this with something better to copy object ?
                issueObj['repo'] = repoObj;
                issueObj['org'] = repoObj.org;
                issueObj['stats'] = getIssuesStats(currentIssue.node.createdAt, currentIssue.node.updatedAt, currentIssue.node.closedAt);
                issueObj['refreshed'] = true;
                issueObj['points'] = null;
                issueObj['active'] = true;

                if (issueObj.labels !== undefined) {
                    //Get points from labels
                    // Regex to test: SP:[.\d]
                    let pointsExp = RegExp('SP:[.\\d]');
                    let boardExp = RegExp('(AB):([.\\d]):(.+)');
                    for (var currentLabel of issueObj.labels.edges) {
                        if (pointsExp.test(currentLabel.node.name)) {
                            let points = parseInt(currentLabel.node.name.replace('SP:', ''));
                            log.info('This issue has ' + points + ' story points');
                            issueObj['points'] = points;
                        }
                        console.log(currentLabel.node.description);
                        console.log(boardExp.test(currentLabel.node.description));
                    }
                }
                await cfgIssues.remove({'id': issueObj.id});
                await cfgIssues.upsert({
                    id: issueObj.id
                }, {
                    $set: issueObj
                });
                */
        this.issuesCount = this.issuesCount + 1;
        setLoadingMsg(this.issuesCount + ' issues loaded');
        /*
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
                */
      }
      lastCursor = currentIssue.cursor;
    }

    if (lastCursor === null) {
      log.info(
        '=> No more updates to load, will not be making another GraphQL call for this repository'
      );
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

  updateChip: PropTypes.func.isRequired
};

const mapState = state => ({
  loadFlag: state.issuesFetch.loadFlag,
  loadRepos: state.issuesFetch.loadRepos,

  log: state.global.log,

  loading: state.loading.loading,
  onSuccess: state.loading.onSuccess
});

const mapDispatch = dispatch => ({
  setLoadFlag: dispatch.issuesFetch.setLoadFlag,

  setLoading: dispatch.loading.setLoading,
  setLoadingMsg: dispatch.loading.setLoadingMsg,
  setLoadingMsgAlt: dispatch.loading.setLoadingMsgAlt,
  setLoadingModal: dispatch.loading.setLoadingModal,
  setLoadingIterateCurrent: dispatch.loading.setLoadingIterateCurrent,
  incLoadingIterateCurrent: dispatch.loading.incLoadingIterateCurrent,
  setLoadingIterateTotal: dispatch.loading.setLoadingIterateTotal,
  setLoadingSuccess: dispatch.loading.setLoadingSuccess,
  setLoadingSuccessMsg: dispatch.loading.setLoadingSuccessMsg,

  updateChip: dispatch.chip.updateChip
});

export default connect(mapState, mapDispatch)(withApollo(Data));
