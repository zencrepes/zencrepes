import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgSources } from './Minimongo.js';
import { cfgIssues } from "./Minimongo.js";

import axios from 'axios';

/*
Load data about GitHub Orgs
 */
class FetchZenhubPoints extends Component {
    constructor (props) {
        super(props);
        this.repositories = [];
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { setLoadFlag, loadFlag } = this.props;
        if (loadFlag) {
            console.log('FetchZenhubPoints - Initiating load');
            setLoadFlag(false);     // Right away set loadRepositories to false
            this.load();            // Logic to load Issues
        }
    };

    // Component should only be updated if loadflag move from false to true (request to load data).
    shouldComponentUpdate(nextProps, nextState) {
        const { loadFlag } = this.props;
        if (!loadFlag && nextProps.loadFlag) {
            return true;
        } else {
            return false;
        }
    };

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    getReposFromZenhubBoards = async (repositories) => {
        const { rateLimitMax, rateLimitUsed, rateLimitPause, token, setRateLimitUsed, setPaused, setMessage } = this.props;
        let currentRateLimitUsed = rateLimitUsed;
        let boardRepos = [];

        for (let repo of repositories) {
            console.log('Obtaining board data for repo: ' + repo.name);
            if (currentRateLimitUsed >=rateLimitMax) {
                console.log('Migth be hitting zenhub API limit, pausing');
                setPaused(true);
                await this.sleep(rateLimitPause);
                setPaused(false);
                currentRateLimitUsed = 0;
            }
            currentRateLimitUsed++;
            setRateLimitUsed(currentRateLimitUsed);

            setMessage('Loading board data for repository: ' + repo.name);
            let response = await axios({
                method:'get',
                url: 'https://api.zenhub.io/p1/repositories/' + repo.databaseId + '/board',
                responseType:'json',
                headers: {'X-Authentication-Token': token},
            });
            let boardIssues = response.data.pipelines
                .map(pipeline => pipeline.issues)
                .reduce((a, b) => [...a, ...b], []);

            console.log(boardIssues);
            if (boardIssues.length > 0) {
                boardRepos.push(repo);
            }
        }
        return {rateLimitUsed: rateLimitUsed, boardRepos: boardRepos}
    };

    getIssuesToRefresh = (repositories) => {
        console.log('getIssuesToRefresh');
        let issues = [];
        for (let repo of repositories) {
            console.log('Listing issues from repo');
            issues.push(
                cfgIssues.find({
                    'repo.databaseId': repo.databaseId,
                    point: null,
                    'metadata.zenhub': null,
                    number: {"$nin": [null, ""]}
                }).fetch()
            );
        }
        return issues.reduce((a, b) => [...a, ...b], []);
    };

    getIssuesDataFromZenhub = async (issues, rateLimitUsed) => {
        const { rateLimitMax, rateLimitPause, token, setRateLimitUsed, setPaused, setMessage, setIncrementLoadedIssues } = this.props;
        console.log('getIssuesDataFromZenhub');

        for (let issue of issues) {
            if (rateLimitUsed >=rateLimitMax) {
                console.log('Might be hitting zenhub API limit, pausing');
                setPaused(true);
                await this.sleep(rateLimitPause);
                setPaused(false);
                rateLimitUsed = 0;
            }
            rateLimitUsed++;
            setRateLimitUsed(rateLimitUsed);

            setMessage('Looking up points for issue: ' + issue.title);
            let response = await axios({
                method:'get',
                url: 'https://api.zenhub.io/p1/repositories/' + issue.repo.databaseId + '/issues/' + issue.number,
                responseType:'json',
                headers: {'X-Authentication-Token': token},
            });
            setIncrementLoadedIssues(1);

            if (response.data.estimate !== undefined) {
                cfgIssues.update({id: issue.id}, {$set:{'points':response.data.estimate.value, 'metadata.zenhub': response.data}});
                console.log('Updated ' + response.data.estimate.value + ' points to: ' + issue.title);
            } else {
                cfgIssues.update({id: issue.id}, {$set:{'metadata.zenhub': response.data}});
                console.log('No points found for issue: ' + issue.title);
            }
        }
    };

    load = async () => {
        const { client, updateChip, setLoading, setLoadError, setMessage, setLoadSuccess, setLoadedIssues, setRateLimitUsed } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedIssues(0);

        let repositories = cfgSources.find({active: true, fetchZenhub: true}).fetch().filter(v => v.databaseId !== undefined);
        //let repositories = cfgSources.find({"org.name":{"$in":["Kids First Data Resource Center","Overture"]}}).fetch().filter(v => v.databaseId !== undefined);
        //let repositories = cfgSources.find({"org.name":{"$in":["Overture"]}}).fetch().filter(v => v.databaseId !== undefined);

        const { rateLimitUsed, boardRepos } = await this.getReposFromZenhubBoards(repositories);
        setRateLimitUsed(rateLimitUsed);

        console.log(rateLimitUsed);
        console.log(boardRepos);

        const issues = await this.getIssuesToRefresh(boardRepos);
        console.log(issues);

        await this.getIssuesDataFromZenhub(issues, rateLimitUsed);

        setMessage('Points have been imported into issues, you might want to push those points to GitHub');

        setLoadSuccess(true);
        setLoading(false);
    };

    render() {
        return null;
    }
}

FetchZenhubPoints.propTypes = {

};

const mapState = state => ({
    loadFlag: state.zenhub.loadFlag,
    loading: state.zenhub.loading,

    rateLimitMax: state.zenhub.rateLimitMax,
    rateLimitUsed: state.zenhub.rateLimitUsed,
    rateLimitPause: state.zenhub.rateLimitPause,
    token: state.zenhub.token,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.zenhub.setLoadFlag,
    setLoading: dispatch.zenhub.setLoading,
    setLoadError: dispatch.zenhub.setLoadError,
    setLoadSuccess: dispatch.zenhub.setLoadSuccess,
    setMessage: dispatch.zenhub.setMessage,

    setRateLimitUsed: dispatch.zenhub.setRateLimitUsed,

    setLoadedIssues: dispatch.zenhub.setLoadedIssues,
    setIncrementLoadedIssues: dispatch.zenhub.setIncrementLoadedIssues,

    setPaused: dispatch.zenhub.setPaused,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(FetchZenhubPoints));
