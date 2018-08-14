import { Component } from 'react'

import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withApollo } from 'react-apollo';

import { cfgSources } from './Minimongo.js';
import { cfgIssues } from "./Minimongo.js";

import axios from 'axios';

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*
Load data about Github Orgs
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

    getReposFromZenhubBoards = async (repositories) => {
        const { rateLimitMax, rateLimitUsed, rateLimitPause, token, setRateLimitUsed, setPaused } = this.props;
        let currentRateLimitUsed = rateLimitUsed;
        let boardRepos = [];

        for (let repo of repositories) {
            console.log('Obtaining board data for repo: ' + repo.name);
            if (currentRateLimitUsed >=rateLimitMax) {
                console.log('Migth be hitting zenhub API limit, pausing');
                setPaused(true);
                await sleep(rateLimitPause);
                setPaused(false);
                currentRateLimitUsed = 0;
            }
            currentRateLimitUsed++;
            setRateLimitUsed(currentRateLimitUsed);

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

    load = async () => {
        const { client, updateChip, setLoading, setLoadError, setLoadSuccess, setLoadedIssues, setIncrementLoadedIssues, setRateLimitUsed } = this.props;

        setLoading(true);       // Set loading to true to indicate content is actually loading.
        setLoadError(false);
        setLoadSuccess(false);
        setLoadedIssues(0);

        let repositories = cfgSources.find({"org.name":{"$in":["Kids First Data Resource Center","Overture"]}}).fetch().filter(v => v.databaseId !== undefined);

        const { rateLimitUsed, boardRepos } = await this.getReposFromZenhubBoards(repositories);
        setRateLimitUsed(rateLimitUsed);

        console.log(rateLimitUsed);
        console.log(boardRepos);

        setLoadSuccess(true);
        setLoading(false);
    };

    render() {
        console.log('render FetchZenhubPoints');
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

    setRateLimitUsed: dispatch.zenhub.setRateLimitUsed,

    setLoadedIssues: dispatch.zenhub.setLoadedIssues,
    setIncrementLoadedIssues: dispatch.zenhub.setIncrementLoadedIssues,

    setPaused: dispatch.zenhub.setPaused,
    setResumeIn: dispatch.zenhub.setResumeIn,

    updateChip: dispatch.chip.updateChip,
});

export default connect(mapState, mapDispatch)(withApollo(FetchZenhubPoints));
