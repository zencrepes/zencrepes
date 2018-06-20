import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

//cfgIssues is the minimongo instance holding all issues imported from GitHub

import GET_GITHUB_ISSUES from '../../graphql/getIssues.graphql';
export const cfgIssues = new Mongo.Collection('cfgIssues', {connection: null});
export const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues');
window.issues = cfgIssues;

//cfgSources is a minimongo instance holding all repositories.
import {cfgSources} from "./Repositories.js";

import calculateQueryIncrement from './calculateQueryIncrement.js';

//Get various stats around issue timing
function getStats(createdAt, updatedAt, closedAt) {
    //This issue has been opened for X days
    let openedDuring = null;
    if (createdAt !== null && closedAt !== null) {
        openedDuring = Math.round((new Date(closedAt) - new Date(createdAt)) / (1000 * 3600 * 24), 0);
    }

    //This issue was first opened X days ago
    let createdSince = null;
    if (createdAt !== null) {
        createdSince = Math.round((new Date() - new Date(createdAt)) / (1000 * 3600 * 24), 0);
    }
    //This issue was closed X days ago
    let closedSince = null;
    if (closedAt !== null) {
        closedSince = Math.round((new Date() - new Date(closedAt)) / (1000 * 3600 * 24), 0);
    }
    //This issue was last updated X days ago
    let updatedSince = null;
    if (updatedAt !== null) {
        updatedSince = Math.round((new Date() - new Date(updatedAt)) / (1000 * 3600 * 24), 0);
    }
    let stats = {
        openedDuring: openedDuring,
        createdSince: createdSince,
        closedSince: closedSince,
        updatedSince: updatedSince,
    };
    return stats;
}

class Issues extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log('FectchIssues - Initialized');

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadIssues, setIssuesLoading, loadIssues, issuesLoading} = this.props;

        if (loadIssues && issuesLoading === false) {
            setLoadIssues(false); // Right away set loadIssues to false
            this.resetCounts(); // Reset all counts since those will be refresh by loadIssues
            this.loadIssues(); // Logic to load Issues
        }

    }

    resetCounts = () => {
        const { setLoadedOrgs, setLoadedRepos, setLoadedIssues, setLoadedIssuesBuffer} = this.props;
        setLoadedOrgs(0);
        setLoadedRepos(0);
        setLoadedIssues(0);
        setLoadedIssuesBuffer(0);
    }

    loadIssues = async () => {
        const { setIssuesLoading, setLoadedOrgs, incrementLoadedRepos, loadIssues, issuesLoading, incrementLoadedIssuesBuffer} = this.props;
        setIssuesLoading(true);  // Set issuesLoading to true to indicate issues are actually loading.

        let allRepos = await cfgSources.find({}).fetch();
        let loadedOrgs = {};
        for (let repo of allRepos) {
            if (repo.active === false) {
                //If repo is inactive, delete any issues attached to this repo (if any)
                //let attachedIssues = cfgIssues.find({'repo.id': repo.id}).count();
                //console.log('Repo is inactive, removing: ' + attachedIssues + ' attached issues');
                await cfgIssues.remove({'repo.id': repo.id});
            } else {
                //If repo is active, load all issues attached to this repo (if any)
                if (repo.issues_count > 0) {
                    console.log('Going through repo: ' + repo.name + ' - Is active and has ' + repo.issues_count + ' issues');

                    //First, marked all existing issues are non-refreshed
                    let updatedDocs = cfgIssues.update({'repo.id': repo.id}, {$set: {'refreshed': false}});
                    console.log('Set the refreshed flag to false for: ' + updatedDocs + ' documents');

                    //Increment the issues buffer, used for showing a progress bar buffer value
                    incrementLoadedIssuesBuffer(repo.issues_count);

                    //Load as many issues as possible
                    let queryIncrement = 100;
                    if (repo.issues_count < 100) {
                        queryIncrement = repo.issues_count;
                    }
                    console.log('Query Increment: ' + queryIncrement);

                    if (this.props.issuesLoading)
                        await this.getIssuesPagination(null, queryIncrement, repo);
                        loadedOrgs[repo.org.id] = true;
                        setLoadedOrgs(Object.keys(loadedOrgs).length);
                }
                incrementLoadedRepos(1);
            }
        }
        console.log('Load completed: ' + cfgIssues.find({}).count() + ' issues loaded');
        setIssuesLoading(false);
    };

    getIssuesPagination = async (cursor, increment, RepoObj) => {
        const { client, issuesLoading } = this.props;
        let data = await client.query({
            query: GET_GITHUB_ISSUES,
            variables: {repo_cursor: cursor, increment: increment, org_name: RepoObj.org.login, repo_name: RepoObj.name},
            fetchPolicy: 'no-cache',

        });
        this.props.updateChip(data.data.rateLimit);
        lastCursor = await this.ingestIssues(data);
        queryIncrement = calculateQueryIncrement(cfgIssues.find({'repo.id': RepoObj.id, 'refreshed': true}).count(), data.data.viewer.organization.repository.issues.totalCount);
        console.log('Loading data for repo:  ' + RepoObj.name + 'Query Increment: ' + queryIncrement);
        if (queryIncrement > 0) {
            await this.getIssuesPagination(lastCursor, queryIncrement, RepoObj);
        }
    }

    ingestIssues = async (data) => {
        let lastCursor = null;
        console.log(data.data.viewer.organization.repository);
        for (let [key, currentIssue] of Object.entries(data.data.viewer.organization.repository.issues.edges)){
            console.log('Loading issue: ' + currentIssue.node.title);
            let existNode = cfgIssues.findOne({id: currentIssue.node.id});

            /*
            let nodeFiltered = false;
            if (existNode !== undefined) {
                nodeFiltered = existNode.filtered;
            }
            */
            let nodePinned = false;
            let nodePoints = null;
            if (existNode !== undefined) {
                nodePinned = existNode.pinned;
                nodePoints = existNode.points;
            }

            let issueObj = {
                id: currentIssue.node.id,
                title: currentIssue.node.title,
                url: currentIssue.node.url,
                author: currentIssue.node.author,
                org: {
                    'login': data.data.viewer.organization.login,
                    'id': data.data.viewer.organization.id,
                    'name': data.data.viewer.organization.name,
                    'url': data.data.viewer.organization.url
                },
                repo: {
                    'name': data.data.viewer.organization.repository.name,
                    'databaseId': data.data.viewer.organization.repository.databaseId,
                    'id': data.data.viewer.organization.repository.id,
                    'url': data.data.viewer.organization.repository.url
                },
                labels: currentIssue.node.labels,
                repo_id: data.data.viewer.organization.repository.id,
                state: currentIssue.node.state,
                milestone: currentIssue.node.milestone,
                assignees: currentIssue.node.assignees,
                createdAt: currentIssue.node.createdAt,
                updatedAt: currentIssue.node.updatedAt,
                closedAt: currentIssue.node.closedAt,
                stats: getStats(currentIssue.node.createdAt, currentIssue.node.updatedAt, currentIssue.node.closedAt),
                comments: currentIssue.node.comments,
                participants: currentIssue.node.participants,
                databaseId: currentIssue.node.databaseId,
                number: currentIssue.node.number,
                refreshed: true,
                pinned: nodePinned,
                points: nodePoints,
            };
            await cfgIssues.upsert({
                id: issueObj.id
            }, {
                $set: issueObj
            });
            this.props.incrementLoadedIssues(1);
            //console.log('LoadRepos: Added: ' + data.data.viewer.organization.login + " / " + currentRepo.node.name);
            lastCursor = currentIssue.cursor
        }
        return lastCursor;
    }

    render() {
        return null;
    }
}

Issues.propTypes = {

};

const mapState = state => ({
    loadIssues: state.github.loadIssues,
    issuesLoading: state.github.issuesLoading,

});

const mapDispatch = dispatch => ({
    setLoadIssues: dispatch.github.setLoadIssues,
    setIssuesLoading: dispatch.github.setIssuesLoading,
    incrementLoadedRepos: dispatch.github.incrementLoadedRepos,
    incrementLoadedIssues: dispatch.github.incrementLoadedIssues,
    incrementLoadedIssuesBuffer: dispatch.github.incrementLoadedIssuesBuffer,
    setLoadedOrgs: dispatch.github.setLoadedOrgs,
    setLoadedRepos: dispatch.github.setLoadedRepos,
    setLoadedIssues: dispatch.github.setLoadedIssues,
    setLoadedIssuesBuffer: dispatch.github.setLoadedIssuesBuffer,
    updateChip: dispatch.chip.updateChip,


});

export default connect(mapState, mapDispatch)(withApollo(Issues));

