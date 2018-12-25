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
        this.state = {};
        this.errorRetry = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setLoadFlag, loadFlag } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (loadFlag === true && prevProps.loadFlag === false) {
            setLoadFlag(false);
            this.load();
        }
    };

    load = async () => {
        const { setLoading, setLoadSuccess, setIterateTotal, incIterateCurrent, setIterateCurrent, updateLabels } = this.props;

        let allRepos = cfgSources.find({}).fetch();
        setIterateTotal(allRepos.length);
        setIterateCurrent(0);
        for (let repo of allRepos) {
            if (repo.active === false) {
                //If repo is inactive, delete any labels attached to this repo (if any)
                console.log('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + cfgLabels.find({'repo.id': repo.id}).count() + ' labels ');
                await cfgLabels.remove({'repo.id': repo.id});
            } else if (repo.active === true) {
                console.log('Processing repo: ' + repo.name + ' - Is active, should have ' + repo.labels.totalCount + ' labels');
                await this.getLabelsPagination(null, 5, repo);
            }
            incIterateCurrent(1);
        }

        console.log('Will be deleting ' + cfgLabels.find({active: false}).count() + ' labels attached to disabled repositories');
        await cfgLabels.remove({active: false});

        console.log('Load completed: There is a total of ' + cfgLabels.find({}).count() + ' labels in memory');
        setLoading(false);  // Set to true to indicate labels are done loading.
        setLoadSuccess(true);
        updateLabels();
    };

    // TODO- There is a big issue with the way the query increment is calculated, if remote has 100 labels, but local only has 99
    // Query increment should not be just 1 since if the missing labels is far down, this will generate a large number of calls
    getLabelsPagination = async (cursor, increment, repoObj) => {
        const { client, setLoadSuccess, setLoading } = this.props;
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
                    console.log(error);
                }
                console.log(repoObj);
                if (data.data !== null) {
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
                        console.log('Loading labels for repo:  ' + repoObj.name + ' - Query Increment: ' + queryIncrement + ' - Local Count: ' + loadedLabelsCount + ' - Remote Count: ' + data.data.repository.labels.totalCount);
                        if (queryIncrement > 0 && lastCursor !== null) {
                            //Start recurring call, to load all labels from a repository
                            await this.getLabelsPagination(lastCursor, queryIncrement, repoObj);
                        }
                    }
                } else {
                    this.errorRetry = this.errorRetry + 1;
                    console.log('Error loading content, current count: ' + this.errorRetry)
                    await this.getLabelsPagination(cursor, increment, repoObj);
                }
            } else {
                console.log('Got too many load errors, stopping');
                setLoadSuccess(false);
                setLoading(false);
            }
        }
    };

    ingestLabels = async (data, repoObj) => {
        const { incLoadedCount } = this.props;

        let lastCursor = null;
        console.log(data);

        for (let currentLabel of Object.entries(data.data.repository.labels.edges)){
            console.log('Loading label: ' + currentLabel.node.name);
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
            incLoadedCount(1);
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

    setLoadFlag: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadSuccess: PropTypes.func.isRequired,
    setLoadedCount: PropTypes.func.isRequired,
    incLoadedCount: PropTypes.func.isRequired,
    setIterateTotal: PropTypes.func.isRequired,
    setIterateCurrent: PropTypes.func.isRequired,
    incIterateCurrent: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,
    updateLabels: PropTypes.func.isRequired,
};

const mapState = state => ({
    loadFlag: state.labelsFetch.loadFlag,
    loading: state.labelsFetch.loading,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsFetch.setLoadFlag,
    setLoading: dispatch.labelsFetch.setLoading,
    setLoadSuccess: dispatch.labelsFetch.setLoadSuccess,
    setLoadedCount: dispatch.labelsFetch.setLoadedCount,

    incLoadedCount: dispatch.labelsFetch.incLoadedCount,
    setIterateTotal: dispatch.labelsFetch.setIterateTotal,
    setIterateCurrent: dispatch.labelsFetch.setIterateCurrent,
    incIterateCurrent: dispatch.labelsFetch.incIterateCurrent,

    updateChip: dispatch.chip.updateChip,
    updateLabels: dispatch.labelsView.updateLabels,
});

export default connect(mapState, mapDispatch)(withApollo(Data));