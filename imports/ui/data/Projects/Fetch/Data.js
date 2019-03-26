import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import GET_GITHUB_PROJECTS from '../../../../graphql/getProjects.graphql';

import { cfgSources } from '../../Minimongo.js';
import { cfgProjects } from '../../Minimongo.js';

import calculateQueryIncrement from '../../utils/calculateQueryIncrement.js';

class Data extends Component {
    constructor (props) {
        super(props);
        this.errorRetry = 0;
        this.projectsCount = 0;
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
                //If repo is inactive, delete any projects attached to this repo (if any)
                log.info('Repo ' + repo.name + ' (' + repo.id + ') is inactive, removing: ' + cfgProjects.find({'repo.id': repo.id}).count() + ' projects ');
                await cfgProjects.remove({'repo.id': repo.id});
            } else if (repo.active === true) {
                log.info('Processing repo: ' + repo.name + ' - Is active, should have ' + repo.projects.totalCount + ' projects');
                setLoadingMsgAlt('Fetching projects from ' + repo.org.login + '/' + repo.name);
                await this.getProjectsPagination(null, 5, repo);
                incLoadingIterateCurrent(1);
                setLoadingSuccessMsg('Fetched ' + this.projectsCount + ' projects');
            }
        }

        log.info('Will be deleting ' + cfgProjects.find({active: false}).count() + ' projects attached to disabled repositories');
        await cfgProjects.remove({active: false});

        log.info('Load completed: There is a total of ' + cfgProjects.find({}).count() + ' projects in memory');
        setLoadingSuccess(true);
        setLoading(false);          // Set to false to indicate labels are done loading.
        this.projectsCount = 0;
        onSuccess();
    };

    // TODO- There is a big issue with the way the query increment is calculated, if remote has 100 projects, but local only has 99
    // Query increment should not be just 1 since if the missing projects is far down, this will generate a large number of calls
    getProjectsPagination = async (cursor, increment, repoObj) => {
        const { client, setLoading, log } = this.props;
        if (this.props.loading) {
            if (this.errorRetry <= 3) {
                let data = {};
                try {
                    data = await client.query({
                        query: GET_GITHUB_PROJECTS,
                        variables: {repo_cursor: cursor, increment: increment, org_name: repoObj.org.login, repo_name: repoObj.name},
                        fetchPolicy: 'no-cache',
                        errorPolicy: 'ignore',
                    });
                }
                catch (error) {
                    log.info(error);
                }
                log.info(repoObj);
                if (data.data !== undefined && data.data !== null) {
                    this.errorRetry = 0;
                    this.props.updateChip(data.data.rateLimit);
                    // Check if the repository actually exist and projects were returned
                    if (data.data.repository !== null && data.data.repository.projects.edges.length > 0) {
                        //data.data.repository.projects.totalCount;
                        // Refresh the repository with the updated projects count
                        cfgSources.update({'id': repoObj.id}, {$set: {'projects.totalCount': data.data.repository.projects.totalCount}});

                        let lastCursor = await this.ingestProjects(data, repoObj);
                        let loadedProjectsCount = cfgProjects.find({'repo.id': repoObj.id, 'refreshed': true}).count();
                        let queryIncrement = calculateQueryIncrement(loadedProjectsCount, data.data.repository.projects.totalCount);
                        log.info('Loading projects for repo:  ' + repoObj.name + ' - Query Increment: ' + queryIncrement + ' - Local Count: ' + loadedProjectsCount + ' - Remote Count: ' + data.data.repository.projects.totalCount);
                        if (queryIncrement > 0 && lastCursor !== null) {
                            //Start recurring call, to load all projects from a repository
                            await this.getProjectsPagination(lastCursor, queryIncrement, repoObj);
                        }
                    }
                } else {
                    this.errorRetry = this.errorRetry + 1;
                    log.info('Error loading content, current count: ' + this.errorRetry);
                    await this.getProjectsPagination(cursor, increment, repoObj);
                }
            } else {
                log.info('Got too many load errors, stopping');
                setLoading(false);
            }
        }
    };

    ingestProjects = async (data, repoObj) => {
        const {
            setLoadingMsg,
            log
        } = this.props;
        let lastCursor = null;
        let stopLoad = false;
        log.info(data);
        for (var currentProject of data.data.repository.projects.edges) {
            log.info('Loading project: ' + currentProject.node.title);
            let existNode = cfgProjects.findOne({id: currentProject.node.id});
            let exitsNodeUpdateAt = null;
            if (existNode !== undefined) {
                exitsNodeUpdateAt = existNode.updatedAt;
            }
            if (new Date(currentProject.node.updatedAt).getTime() === new Date(exitsNodeUpdateAt).getTime()) {
                log.info('Project already loaded, skipping');
                // Projects are loaded from newest to oldest, when it gets to a point where updated date of a loaded project
                // is equal to updated date of a local project, it means there is no "new" content, but there might still be
                // projects that were not loaded for any reason. So the system only stops loaded if totalCount remote is equal
                //  to the total number of projects locally
                if (data.data.repository.projects.totalCount === cfgProjects.find({'repo.id': repoObj.id}).count()) {
                    stopLoad = true;
                }
            } else {
                log.info('New or updated project');
                let projectObj = JSON.parse(JSON.stringify(currentProject.node)); //TODO - Replace this with something better to copy object ?
                projectObj['repo'] = repoObj;
                projectObj['org'] = repoObj.org;
                projectObj['refreshed'] = true;
                projectObj['active'] = true;

                await cfgProjects.remove({'id': projectObj.id});
                await cfgProjects.upsert({
                    id: projectObj.id
                }, {
                    $set: projectObj
                });
            }
            this.projectsCount = this.projectsCount + 1;
            setLoadingMsg(this.projectsCount + ' projects loaded');
            lastCursor = currentProject.cursor;
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
    loadFlag: state.projectsFetch.loadFlag,
    loadRepos: state.projectsFetch.loadRepos,

    log: state.global.log,

    loading: state.loading.loading,
    onSuccess: state.loading.onSuccess,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.projectsFetch.setLoadFlag,

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