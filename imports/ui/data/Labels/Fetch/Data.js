import { Component } from 'react'

import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_LABELS from '../../../../graphql/getLabels.graphql';

import { cfgSources } from '../../Minimongo.js';
import { cfgLabels } from '../../Minimongo.js';

import calculateQueryIncrement from '../../utils/calculateQueryIncrement.js';
import PropTypes from "prop-types";

class Data extends Component {
    constructor (props) {
        super(props);
        this.errorRetry = 0;
        this.labelsCount = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setLoadFlag, loadFlag, loading } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (loadFlag === true && prevProps.loadFlag === false && loading === false) {
            setLoadFlag(false);
            this.load();
        }
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
            log,
            loadRepos,
            onSuccess
        } = this.props;

        //Check if there if we are loading everything or just data for a subset of repositories
        let reposQuery = {};
        if (loadRepos.length > 0) {
            reposQuery = {"id":{"$in":loadRepos}}
        }

        let allRepos = cfgSources.find(reposQuery).fetch();
        setLoading(true);
        setLoadingIterateTotal(allRepos.filter(repo => repo.active === true).length);
        setLoadingIterateCurrent(0);
        for (let repo of allRepos) {
            if (repo.active === false) {
                //If repo is inactive, delete any labels attached to this repo (if any)
                log.info('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + cfgLabels.find({'repo.id': repo.id}).count() + ' labels ');
                await cfgLabels.remove({'repo.id': repo.id});
            } else if (repo.active === true) {
                log.info('Processing repo: ' + repo.name + ' - Is active, should have ' + repo.labels.totalCount + ' labels');
                setLoadingMsgAlt('Fetching labels from ' + repo.org.login + '/' + repo.name);
                await this.getLabelsPagination(null, 5, repo);
                incLoadingIterateCurrent(1);
                setLoadingSuccessMsg('Fetched ' + this.labelsCount + ' labels');
            }
        }

        log.info('Will be deleting ' + cfgLabels.find({active: false}).count() + ' labels attached to disabled repositories');
        await cfgLabels.remove({active: false});

        log.info('Load completed: There is a total of ' + cfgLabels.find({}).count() + ' labels in memory');
        setLoadingSuccess(true);
        setLoading(false);          // Set to false to indicate labels are done loading.
        this.labelsCount = 0;
        onSuccess();
    };

    // TODO- There is a big issue with the way the query increment is calculated, if remote has 100 labels, but local only has 99
    // Query increment should not be just 1 since if the missing labels is far down, this will generate a large number of calls
    getLabelsPagination = async (cursor, increment, repoObj) => {
        const { client, setLoading, log } = this.props;
        if (this.props.loading) {
            if (this.errorRetry <= 3) {
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_LABELS,
                        variables: {repo_cursor: cursor, increment: increment, org_name: repoObj.org.login, repo_name: repoObj.name},
                        fetchPolicy: 'no-cache',
                        errorPolicy: 'ignore',
                    });
                }
                catch (error) {
                    log.warn(error);
                }
                log.info(repoObj);
                if (data.data !== undefined && data.data !== null) {
                    this.errorRetry = 0;
                    this.props.updateChip(data.data.rateLimit);
                    // Check if the repository actually exist and labels were returned
                    if (data.data.repository !== null && data.data.repository.labels.edges.length > 0) {
                        //data.data.repository.labels.totalCount;
                        // Refresh the repository with the updated labels count
                        cfgSources.update({'id': repoObj.id}, {$set: {'labels.totalCount': data.data.repository.labels.totalCount}});

                        let lastCursor = await this.ingestLabels(data, repoObj);
                        let loadedLabelsCount = cfgLabels.find({'repo.id': repoObj.id, 'refreshed': true}).count();
                        let queryIncrement = calculateQueryIncrement(loadedLabelsCount, data.data.repository.labels.totalCount);
                        log.info('Loading labels for repo:  ' + repoObj.name + ' - Query Increment: ' + queryIncrement + ' - Local Count: ' + loadedLabelsCount + ' - Remote Count: ' + data.data.repository.labels.totalCount);
                        if (queryIncrement > 0 && lastCursor !== null) {
                            //Start recurring call, to load all labels from a repository
                            await this.getLabelsPagination(lastCursor, queryIncrement, repoObj);
                        }
                    }
                } else {
                    this.errorRetry = this.errorRetry + 1;
                    log.warn('Error loading content, current count: ' + this.errorRetry)
                    await this.getLabelsPagination(cursor, increment, repoObj);
                }
            } else {
                log.warn('Got too many load errors, stopping');
                setLoading(false);
            }
        }
    };

    ingestLabels = async (data, repoObj) => {
        const {
            setLoadingMsg,
            log
        } = this.props;

        let lastCursor = null;
        for (var currentLabel of data.data.repository.labels.edges) {
            log.info('Loading label: ' + currentLabel.node.name);
            //let existNode = cfgLabels.findOne({id: currentLabel.node.id});

            let labelObj = JSON.parse(JSON.stringify(currentLabel.node)); //TODO - Replace this with something better to copy object ?
            labelObj['repo'] = repoObj;
            labelObj['org'] = repoObj.org;
            labelObj['refreshed'] = true;
            await cfgLabels.upsert({
                id: labelObj.id
            }, {
                $set: labelObj
            });
            this.labelsCount = this.labelsCount + 1;
            setLoadingMsg(this.labelsCount + ' labels loaded');
            //console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name);
            lastCursor = currentLabel.cursor
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
    loadFlag: state.labelsFetch.loadFlag,
    loadRepos: state.labelsFetch.loadRepos,

    log: state.global.log,

    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsFetch.setLoadFlag,

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