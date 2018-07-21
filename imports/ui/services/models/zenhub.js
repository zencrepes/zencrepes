import { cfgIssues } from '../../data/Minimongo.js';
import { cfgSources } from '../../data/Minimongo.js';
import axios from 'axios';

//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const getReposFromZenhubBoards = async (repositories, rootState) => {
    console.log('getReposFromZenhubBoards');
    console.log(repositories);
    let { rateLimitMax, rateLimitUsed, rateLimitPause, token } = rootState.zenhub;

    let boardRepos = [];
    for (let repo of repositories) {
        console.log('Obtaining board data for repo: ' + repo.name);
        if (rateLimitUsed >=rateLimitMax) {
            console.log('Migth be hitting zenhub API limit, pausing');
            await sleep(rateLimitPause);
            rateLimitUsed = 0;
        }
        rateLimitUsed++;

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

const getIssuesToRefresh = (repositories) => {
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

const getIssuesDataFromZenhub = async (issues, rootState, rateLimitUsed) => {
    console.log('getIssuesDataFromZenhub');
    let { rateLimitMax, rateLimitPause, token } = rootState.zenhub;

    for (let issue of issues) {
        console.log('Points: ' + rateLimitUsed);
        if (rateLimitUsed >=rateLimitMax) {
            console.log('Migth be hitting zenhub API limit, pausing');
            await sleep(rateLimitPause);
            rateLimitUsed = 0;
        }
        rateLimitUsed++;

        let response = await axios({
            method:'get',
            url: 'https://api.zenhub.io/p1/repositories/' + issue.repo.databaseId + '/issues/' + issue.number,
            responseType:'json',
            headers: {'X-Authentication-Token': token},
        });

        if (response.data.estimate !== undefined) {
            cfgIssues.update({id: issue.id}, {$set:{'points':response.data.estimate.value, 'metadata.zenhub': response.data}});
            console.log('Updated ' + response.data.estimate.value + ' points to: ' + issue.title);
        } else {
            cfgIssues.update({id: issue.id}, {$set:{'metadata.zenhub': response.data}});
            console.log('No points found for issue: ' + issue.title);
        }
    }
};

export default {
    state: {
        loadFlag: false,    // Flag to indicate the data should be reloaded
        loading: false,     // Data is currently loading
        token: '',          // Zenhub Token
        rateLimitMax: 80,      // To handle Zenhub API rate limiting
        rateLimitUsed: 0,       // To handle Zenhub API rate limiting
        rateLimitPause: 60000,   // in ms - To handle Zenhub API rate limiting

    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setToken(state, payload) {return { ...state, token: payload };},
        setRateLimitUsed(state, payload) {return { ...state, rateLimitUsed: payload };},
    },
    effects: {
        async initStates(payload, rootState) {
            console.log('Init state');
            this.setLoading(true);
            console.log(rootState);

            //1-Get the list of repositories that might be relevant for Zenhub
            let repositories = cfgSources.find({"org.name":{"$in":["Kids First Data Resource Center","Overture"]}}).fetch().filter(v => v.databaseId !== undefined);

//            this.setRateLimitUsed(0);
//            let date = new Date();
//            this.setRateLimitReset(new Date().setMinutes(date.getMinutes() + 1));

            //2- Get the list of zenhub boards with issues in it (this is to further reduce the number of calls to Zenhub api)

            const { rateLimitUsed, boardRepos } = await getReposFromZenhubBoards(repositories, rootState);
            this.setRateLimitUsed(rateLimitUsed);

            const issues = await getIssuesToRefresh(boardRepos);

            await getIssuesDataFromZenhub(issues, rootState, rateLimitUsed);

            /*
             .forEach(async (repo) => {
             let response = await axios({
             method:'get',
             url: 'https://api.zenhub.io/p1/repositories/' + repo.databaseId + '/board',
             responseType:'json',
             headers: {'X-Authentication-Token': token},
             });
             callCount++;
             let boardIssues = response.data.pipelines
             .map(pipeline => pipeline.issues)
             .reduce((a, b) => [...a, ...b], []);
             */

            this.setLoading(false);
        }
    }
};