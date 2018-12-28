import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_SINGLE_REPO from '../../../../../graphql/getSingleRepo.graphql';
import GET_GITHUB_MILESTONES from '../../../../../graphql/getMilestones.graphql';

import { cfgMilestones } from '../../../Minimongo.js';
import {cfgSources} from "../../../Minimongo";
import calculateQueryIncrement from "../../../utils/calculateQueryIncrement";

class Staging extends Component {
    constructor (props) {
        super(props);
        this.syncedMilestones = [];
        this.errorRetry = 0;
    }

    componentDidUpdate = (prevProps) => {
        const { setVerifFlag, verifFlag } = this.props;
        // Only trigger load if loadFlag transitioned from false to true
        if (verifFlag === true && prevProps.verifFlag === false) {
            setVerifFlag(false);
            this.load();
        }
    };

    load = async () => {
        const { setVerifying, setVerifyingMsg, repos, onStagingSuccess, setVerifiedRepos, insVerifiedRepos, client, milestoneTitle } = this.props;
        setVerifiedRepos([]);
        setVerifyingMsg('About verify data about from ' + repos.length + ' repos');
//        for (let milestone of milestones) {
        for (const [idx, repo] of repos.entries()) {
            if (this.props.verifying) {
                this.syncedMilestones = [];
                let baseMsg = (idx+1) + '/' + repos.length + ' - Fetching data for repo: ' + repo.org.login + '/' + repo.name;
                setVerifyingMsg(baseMsg);
                console.log(baseMsg);
                // 1- Fetch updated Repo data
                // 2- Fetch all milestones for repo
                // 3- Verify if identical title exists
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_SINGLE_REPO,
                        variables: {
                            org_name: repo.org.login,
                            repo_name: repo.name,
                        },
                        fetchPolicy: 'no-cache',
                        errorPolicy: 'ignore',
                    });
                }
                catch (error) {
                    console.log(error);
                }
                console.log(data);
                this.props.updateChip(data.data.rateLimit);

                const repoData = {...data.data.repository, org: repo.org};
                console.log(repoData);
                await cfgSources.upsert({
                    id: repoData.id
                }, {
                    $set: repoData
                });

                console.log(this.syncedMilestones);
                let fetchIncrement = 100;
                if (repoData.milestones.totalCount < 100) {fetchIncrement = repoData.milestones.totalCount}
                await this.getMilestonesPagination(null, fetchIncrement, repoData);
                console.log(this.syncedMilestones);

                const filteredSyncedMilestones = this.syncedMilestones.filter(m => m.title === milestoneTitle);
                if (filteredSyncedMilestones.length > 0) {
                    insVerifiedRepos({
                        id: repo.id,
                        error: true,
                        errorMsg: 'A milestone with this title already exists in this repository.',
                    });
                } else {
                    insVerifiedRepos({
                        id: repo.id,
                        error: false,
                    });
                }
            }
        }
        setVerifying(false);
        console.log(onStagingSuccess);
        onStagingSuccess();
    };


    // TODO- There is a big issue with the way the query increment is calculated, if remote has 100 milestones, but local only has 99
    // Query increment should not be just 1 since if the missing milestones is far down, this will generate a large number of calls
    getMilestonesPagination = async (cursor, increment, repoObj) => {
        const { client } = this.props;
        if (this.props.verifying) {
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
                        let lastCursor = await this.ingestMilestones(data, repoObj);
                        let loadedMilestonesCount = this.syncedMilestones.length;
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
            }
        }
    };

    ingestMilestones = async (data, repoObj) => {
        let lastCursor = null;
        let stopLoad = false;
        console.log(data);
        for (var currentMilestone of data.data.repository.milestones.edges) {
            console.log('Loading milestone: ' + currentMilestone.node.title);
            console.log('New or updated milestone');
            let milestoneObj = JSON.parse(JSON.stringify(currentMilestone.node)); //TODO - Replace this with something better to copy object ?
            milestoneObj['repo'] = repoObj;
            milestoneObj['org'] = repoObj.org;
            milestoneObj['refreshed'] = true;
            milestoneObj['active'] = true;
            await cfgMilestones.upsert({
                id: milestoneObj.id
            }, {
                $set: milestoneObj
            });
            console.log(milestoneObj);
            this.syncedMilestones.push(milestoneObj);
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

Staging.propTypes = {
    verifFlag: PropTypes.bool.isRequired,
    verifying: PropTypes.bool.isRequired,
    milestoneTitle: PropTypes.string.isRequired,
    repos: PropTypes.array.isRequired,
    onStagingSuccess: PropTypes.func.isRequired,

    setVerifFlag: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setVerifyingMsg: PropTypes.func.isRequired,
    setVerifiedRepos: PropTypes.func.isRequired,
    insVerifiedRepos: PropTypes.func.isRequired,
    updateChip: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifFlag: state.milestonesCreate.verifFlag,
    verifying: state.milestonesCreate.verifying,

    milestoneTitle: state.milestonesCreate.milestoneTitle,

    repos: state.milestonesCreate.repos,
    onStagingSuccess: state.milestonesCreate.onStagingSuccess,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.milestonesCreate.setVerifFlag,
    setVerifying: dispatch.milestonesCreate.setVerifying,
    setVerifyingMsg: dispatch.milestonesCreate.setVerifyingMsg,
    setVerifiedRepos: dispatch.milestonesCreate.setVerifiedRepos,
    insVerifiedRepos: dispatch.milestonesCreate.insVerifiedRepos,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(Staging));