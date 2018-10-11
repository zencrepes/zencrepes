import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_MILESTONES from '../../../../graphql/getMilestones.graphql';

import { cfgSources } from '../../Minimongo.js';
import { cfgMilestones } from '../../Minimongo.js';

import calculateQueryIncrement from '../../utils/calculateQueryIncrement.js';

class Data extends Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.errorRetry = 0;
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { setLoadFlag, loadFlag, loading } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (loadFlag === true && prevProps.loadFlag === false) {
            setLoadFlag(false);
            this.load();
        }
    };

    load = async () => {
        const { setLoading, setLoadSuccess, setLoadError, setLoadedCount, setIterateTotal, incIterateCurrent, setIterateCurrent, updateMilestones } = this.props;

        let allRepos = cfgSources.find({}).fetch();
        setIterateTotal(allRepos.length);
        setIterateCurrent(0);
        for (let repo of allRepos) {
            if (repo.active === false) {
                //If repo is inactive, delete any milestones attached to this repo (if any)
                console.log('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + cfgMilestones.find({'repo.id': repo.id}).count() + ' milestones ');
                await cfgMilestones.remove({'repo.id': repo.id});
            } else if (repo.active === true) {
                console.log('Processing repo: ' + repo.name + ' - Is active, should have ' + repo.milestones.totalCount + ' milestones');
                await this.getMilestonesPagination(null, 5, repo);
            }
            incIterateCurrent(1);
        }

        console.log('Will be deleting ' + cfgMilestones.find({active: false}).count() + ' milestones attached to disabled repositories');
        await cfgMilestones.remove({active: false});

        console.log('Load completed: There is a total of ' + cfgMilestones.find({}).count() + ' milestones in memory');
        setLoading(false);  // Set to true to indicate milestones are done loading.
        setLoadSuccess(true);
        updateMilestones();
    };

    // TODO- There is a big issue with the way the query increment is calculated, if remote has 100 milestones, but local only has 99
    // Query increment should not be just 1 since if the missing milestones is far down, this will generate a large number of calls
    getMilestonesPagination = async (cursor, increment, repoObj) => {
        const { client, setLoadSuccess, setLoading } = this.props;
        if (this.props.loading) {
            if (this.errorRetry <= 3) {
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_MILESTONES,
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
                    // Check if the repository actually exist and milestones were returned
                    if (data.data.repository !== null && data.data.repository.milestones.edges.length > 0) {
                        //data.data.repository.milestones.totalCount;
                        // Refresh the repository with the updated milestones count
                        let updatedRepo = cfgSources.update({'id': repoObj.id}, {$set: {'milestones.totalCount': data.data.repository.milestones.totalCount}});

                        let lastCursor = await this.ingestMilestones(data, repoObj);
                        let loadedMilestonesCount = cfgMilestones.find({'repo.id': repoObj.id, 'refreshed': true}).count();
                        let queryIncrement = calculateQueryIncrement(loadedMilestonesCount, data.data.repository.milestones.totalCount);
                        console.log('Loading milestones for repo:  ' + repoObj.name + ' - Query Increment: ' + queryIncrement + ' - Local Count: ' + loadedMilestonesCount + ' - Remote Count: ' + data.data.repository.milestones.totalCount);
                        if (queryIncrement > 0 && lastCursor !== null) {
                            //Start recurring call, to load all milestones from a repository
                            await this.getMilestonesPagination(lastCursor, queryIncrement, repoObj);
                        }
                    }
                } else {
                    this.errorRetry = this.errorRetry + 1;
                    console.log('Error loading content, current count: ' + this.errorRetry)
                    await this.getMilestonesPagination(cursor, increment, repoObj);
                }
            } else {
                console.log('Got too many load errors, stopping');
                setLoadSuccess(false);
                setLoading(false);
            }
        }
    };

    ingestMilestones = async (data, repoObj) => {
        const { incLoadedCount } = this.props;

        let lastCursor = null;
        let stopLoad = false;
        console.log(data);
        for (let [key, currentMilestone] of Object.entries(data.data.repository.milestones.edges)){
            console.log('Loading milestone: ' + currentMilestone.node.title);
            let existNode = cfgMilestones.findOne({id: currentMilestone.node.id});
            let exitsNodeUpdateAt = null;
            if (existNode !== undefined) {
                exitsNodeUpdateAt = existNode.updatedAt;
            }
            if (new Date(currentMilestone.node.updatedAt).getTime() === new Date(exitsNodeUpdateAt).getTime()) {
                console.log('Milestone already loaded, skipping');
                // Milestones are loaded from newest to oldest, when it gets to a point where updated date of a loaded milestone
                // is equal to updated date of a local milestone, it means there is no "new" content, but there might still be
                // milestones that were not loaded for any reason. So the system only stops loaded if totalCount remote is equal
                //  to the total number of milestones locally
                if (data.data.repository.milestones.totalCount === cfgMilestones.find({'repo.id': repoObj.id}).count()) {
                    stopLoad = true;
                }
            } else {
                console.log('New or updated milestone');
                let nodePinned = false;
                let nodePoints = null;
                if (existNode !== undefined) {
                    nodePinned = existNode.pinned;
                    nodePoints = existNode.points;
                }
                let milestoneObj = JSON.parse(JSON.stringify(currentMilestone.node)); //TODO - Replace this with something better to copy object ?
                milestoneObj['repo'] = repoObj;
                milestoneObj['org'] = repoObj.org;
                milestoneObj['refreshed'] = true;
                milestoneObj['active'] = true;

                await cfgMilestones.remove({'id': milestoneObj.id});
                await cfgMilestones.upsert({
                    id: milestoneObj.id
                }, {
                    $set: milestoneObj
                });
                incLoadedCount(1);
            }
            lastCursor = currentMilestone.cursor;
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
    loadFlag: state.milestonesFetch.loadFlag,
    loading: state.milestonesFetch.loading,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesFetch.setLoadFlag,
    setLoading: dispatch.milestonesFetch.setLoading,
    setLoadSuccess: dispatch.milestonesFetch.setLoadSuccess,
    setLoadedCount: dispatch.milestonesFetch.setLoadedCount,

    incLoadedCount: dispatch.milestonesFetch.incLoadedCount,
    setIterateTotal: dispatch.milestonesFetch.setIterateTotal,
    setIterateCurrent: dispatch.milestonesFetch.setIterateCurrent,
    incIterateCurrent: dispatch.milestonesFetch.incIterateCurrent,

    updateChip: dispatch.chip.updateChip,
    updateMilestones: dispatch.milestonesView.updateMilestones,

});

export default connect(mapState, mapDispatch)(withApollo(Data));