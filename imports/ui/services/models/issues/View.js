import _ from 'lodash';

import { cfgIssues } from '../../../data/Minimongo.js';

import { refreshBurndown } from '../../../utils/burndown/index.js';
import { refreshFacets } from '../../../utils/facets/index.js';
import { refreshVelocity } from '../../../utils/velocity/index.js';

export default {
    state: {
        issues: [],
        facets: [],

        selectedTab: 0, // Selected tab to be displayed

        query: {},

        defaultPoints: true,    // Default display to points, otherwise issues count

        burndown: {},
        shouldBurndownDataReload: false,  // We don't want to reload the burndown data automatically when issues are changed

        velocity: {},
        shouldVelocityDataReload: false,  // We don't want to reload the velocity data automatically when issues are changed

        remainingWorkRepos: [],                  // List repos with open issues
        remainingWorkPoints: 0,
        remainingWorkCount: 0,
        shouldSummaryDataReload: false,

    },
    reducers: {
        setIssues(state, payload) {return { ...state, issues: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},
        setSelectedTab(state, payload) {return { ...state, selectedTab: payload };},

        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},

        setShouldBurndownDataReload(state, payload) {return { ...state, shouldBurndownDataReload: payload };},
        setBurndown(state, payload) {return { ...state, burndown: JSON.parse(JSON.stringify(payload)) };},

        setShouldVelocityDataReload(state, payload) {return { ...state, shouldVelocityDataReload: payload };},
        setVelocity(state, payload) {return { ...state, velocity: JSON.parse(JSON.stringify(payload)) };},

        setShouldSummaryDataReload(state, payload) {return { ...state, shouldSummaryDataReload: payload };},
        setRemainingWorkRepos(state, payload) {return { ...state, remainingWorkRepos: payload };},
        setRemainingWorkPoints(state, payload) {return { ...state, remainingWorkPoints: payload };},
        setRemainingWorkCount(state, payload) {return { ...state, remainingWorkCount: payload };},

    },
    effects: {
        async initIssues(payload, rootState) {
            console.log('initIssues');

            this.refreshFacets();
            this.refreshIssues();

            this.setShouldBurndownDataReload(true);
            this.setShouldVelocityDataReload(true);
            this.setShouldSummaryDataReload(true);
        },

        async refreshIssues(payload, rootState) {
            let issues = cfgIssues.find(rootState.issuesView.query).fetch();
            this.setIssues(issues);
        },

        async refreshSummary(payload, rootState) {
            let t0 = performance.now();

            let query = rootState.issuesView.query;
            let openedIssuesFilter = {...query, ...{'state':{$in:['OPEN']}}};
            let openedIssues = cfgIssues.find(openedIssuesFilter).fetch();

            let repos = [];
            statesGroup = _.groupBy(openedIssues, 'repo.name');
            Object.keys(statesGroup).forEach(function(key) {
                repos.push({
                    count: statesGroup[key].length,
                    name: key,
                    issues: statesGroup[key],
                    points: statesGroup[key].map(i => i.points).reduce((acc, points) => acc + points, 0)
                });
            });
            console.log(repos);
            this.setRemainingWorkRepos(repos);
            this.setRemainingWorkPoints(repos.map(r => r.points).reduce((acc, points) => acc + points, 0));
            this.setRemainingWorkCount(repos.map(r => r.issues.length).reduce((acc, count) => acc + count, 0));

            var t1 = performance.now();
            console.log("refreshSummary - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshFacets(payload, rootState) {
            let t0 = performance.now();

            let issues = cfgIssues.find(rootState.issuesView.query).fetch();
            let updatedFacets = refreshFacets(issues);
            this.setFacets(updatedFacets);

            var t1 = performance.now();
            console.log("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshBurndown(payload, rootState) {
            let t0 = performance.now();

            this.setShouldBurndownDataReload(false);

            console.log('refreshBurndown');
            console.log(rootState.issuesView.query);

            let mongoFilter = rootState.issuesView.query;
            let burndownData = await refreshBurndown(mongoFilter, cfgIssues);

            this.setBurndown(burndownData);

            var t1 = performance.now();
            console.log("refreshBurndown - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshVelocity(payload, rootState) {
            let t0 = performance.now();

            this.setShouldVelocityDataReload(false);

            console.log('refreshVelocity');
            console.log(rootState.issuesView.query);


            let mongoFilter = rootState.issuesView.query;
            let velocityData = await refreshVelocity(mongoFilter, cfgIssues);

            this.setVelocity(velocityData);

            var t1 = performance.now();
            console.log("refreshVelocity - took " + (t1 - t0) + " milliseconds.");
        },
    }
};

