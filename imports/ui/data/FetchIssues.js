import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

//cfgIssues is the minimongo instance holding all issues imported from GitHub

import GET_GITHUB_ISSUES from '../../graphql/getIssues.graphql';
export const cfgIssues = new Mongo.Collection('cfgIssues', {connection: null});
export const localCfgIssues = new PersistentMinimongo2(cfgIssues, 'GAV-Issues');

//cfgSources is a minimongo instance holding all repositories.
import {cfgSources} from "./Repositories.js";

class FetchIssues extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log('FectchIssues - Initialized');

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadIssues, setIssuesLoading, loadIssues, issuesLoading} = this.props;

        if (loadIssues) {
            setLoadIssues(false); // Right away set loadIssues to false
            this.resetCounts(); // Reset all counts since those will be refresh by loadIssues
            this.loadIssues(); // Logic to load Issues
        }

    }

    resetCounts = () => {
        const { setLoadedOrgs, setLoadedRepos, setLoadedIssues} = this.props;
        setLoadedOrgs(0);
        setLoadedRepos(0);
        setLoadedIssues(0);
    }

    loadIssues = async () => {
        const { setIssuesLoading, incrementLoadedRepos, loadIssues, issuesLoading} = this.props;
        console.log(issuesLoading);
        setIssuesLoading(true);  // Set issuesLoading to true to indicate issues are actually loading.
        console.log(issuesLoading);


        let allRepos = await cfgSources.find({}).fetch();
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

                    //Load as many issues as possible
                    let queryIncrement = 100;
                    if (repo.issues_count < 100) {
                        queryIncrement = repo.issues_count;
                    }
                    console.log('Query Increment: ' + queryIncrement);

                    if (this.props.issuesLoading)
                        await this.getIssuesPagination(null, queryIncrement, repo);
                }
                incrementLoadedRepos(1);
            }
        }
        setIssuesLoading(false);
        console.log('Load completed: ' + cfgIssues.find({}).count() + ' issues loaded');
    }

    getIssuesPagination = async (cursor, increment, RepoObj) => {
        const { client, issuesLoading } = this.props;
        let data = await client.query({
            query: GET_GITHUB_ISSUES,
            variables: {repo_cursor: cursor, increment: increment, org_name: RepoObj.org.login, repo_name: RepoObj.name}
        });
        /*
        this.updateChip(data.data.rateLimit);
        lastCursor = await this.loadIssues(data);
        queryIncrement = calculateQueryIncrement(cfgIssues.find({'repo.id': RepoObj.id, 'refreshed': true}).count(), data.data.viewer.organization.repository.issues.totalCount);
        console.log('Loading data for repo:  ' + RepoObj.name + 'Query Increment: ' + queryIncrement);
        if (queryIncrement > 0) {
            await this.getIssuesPagination(lastCursor, queryIncrement, RepoObj);
        }
        */
    }

    render() {
        return null;
    }
}

FetchIssues.propTypes = {

};

const mapState = state => ({
    loadIssues: state.github.loadIssues,
    issuesLoading: state.github.issuesLoading,

});

const mapDispatch = dispatch => ({
    setLoadIssues: dispatch.github.setLoadIssues,
    setIssuesLoading: dispatch.github.setIssuesLoading,
    incrementLoadedRepos: dispatch.github.incrementLoadedRepos,
    setLoadedOrgs: dispatch.github.setLoadedOrgs,
    setLoadedRepos: dispatch.github.setLoadedRepos,
    setLoadedIssues: dispatch.github.setLoadedIssues,


});

export default connect(mapState, mapDispatch)(withApollo(FetchIssues));

