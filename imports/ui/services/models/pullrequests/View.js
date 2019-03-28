import _ from 'lodash';

import { cfgPullrequests, cfgQueries } from '../../../data/Minimongo.js';

import { refreshBurndown } from '../../../utils/burndown/index.js';
import { buildFacets } from '../../../utils/facets/pullrequests.js';
import { refreshVelocity } from '../../../utils/velocity/index.js';

export default {
    state: {
        pullrequests: [],
        filteredPullrequests: [],
        filteredPullrequestsSearch: '',
        facets: [],
        queries: [],

        selectedTab: 0, // Selected tab to be displayed

        query: {},

        defaultPoints: false,    // Default display to points, otherwise pullrequests count

        burndown: {},
        shouldBurndownDataReload: false,  // We don't want to reload the burndown data automatically when pullrequests are changed

        velocity: {},
        shouldVelocityDataReload: false,  // We don't want to reload the velocity data automatically when pullrequests are changed

        remainingWorkRepos: [],                  // List repos with open pullrequests
        remainingWorkPoints: 0,
        remainingWorkCount: 0,
        shouldSummaryDataReload: false,

        statsOpenedDuring: [],
        statsCreatedSince: [],

    },
    reducers: {
        setPullrequests(state, payload) {return { ...state, pullrequests: payload };},
        setFilteredPullrequests(state, payload) {return { ...state, filteredPullrequests: payload };},
        setFilteredPullrequestsSearch(state, payload) {return { ...state, filteredPullrequestsSearch: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},
        setQueries(state, payload) {return { ...state, queries: payload };},
        setSelectedTab(state, payload) {return { ...state, selectedTab: payload };},

        setQuery(state, payload) {return { ...state, query: JSON.parse(JSON.stringify(payload)) };},

        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},

        setShouldBurndownDataReload(state, payload) {return { ...state, shouldBurndownDataReload: payload };},
        setBurndown(state, payload) {return { ...state, burndown: JSON.parse(JSON.stringify(payload)) };},

        setShouldVelocityDataReload(state, payload) {return { ...state, shouldVelocityDataReload: payload };},
        setVelocity(state, payload) {return { ...state, velocity: JSON.parse(JSON.stringify(payload)) };},

        setShouldSummaryDataReload(state, payload) {return { ...state, shouldSummaryDataReload: payload };},
        setRemainingWorkRepos(state, payload) {return { ...state, remainingWorkRepos: payload };},
        setRemainingWorkPoints(state, payload) {return { ...state, remainingWorkPoints: payload };},
        setRemainingWorkCount(state, payload) {return { ...state, remainingWorkCount: payload };},

        setStatsOpenedDuring(state, payload) {return { ...state, statsOpenedDuring: payload };},
        setStatsCreatedSince(state, payload) {return { ...state, statsCreatedSince: payload };},
    },
    effects: {
        async updateQuery(query) {
            if (query === null) {this.setQuery({});}
            else {this.setQuery(query);}

            // Check if the query doesn't return any pullrequests with points, set default back to pullrequests count.
            const pointsQuery = {...query, points: {$gt: 0}};
            if (cfgPullrequests.find(pointsQuery).count() === 0) {this.setDefaultPoints(false);}

            this.updateView();
        },

        async clearPullrequests() {
            cfgPullrequests.remove({});
            this.setPullrequests([]);
            this.setQuery({});
            this.updateView();
        },

        async updateView() {
            this.refreshQueries();
            this.refreshFacets();
            this.refreshPullrequests();
            this.refreshBins();

            this.setShouldBurndownDataReload(true);
            this.refreshSummary();
            this.refreshVelocity();
        },

        async deleteQuery(query) {
            await cfgQueries.remove({'_id': query._id});
            this.refreshQueries();
        },

        async refreshQueries() {
            this.setQueries(cfgQueries.find({}).fetch());
        },

        async saveQuery(queryName, rootState) {
            if (cfgQueries.find({filters: JSON.stringify(rootState.pullrequestsView.query)}).count() === 0) {
                await cfgQueries.insert({
                    name: queryName,
                    filters: JSON.stringify(rootState.pullrequestsView.query),
                });
            }
            this.refreshQueries();
        },

        async refreshPullrequests(payload, rootState) {
            let pullrequests = cfgPullrequests.find(rootState.pullrequestsView.query).fetch();
            this.setPullrequests(pullrequests);
            this.setFilteredPullrequests(pullrequests);
            this.setFilteredPullrequestsSearch('');
        },

        async searchPullrequests(searchString, rootState) {
            let pullrequests = rootState.pullrequestsView.pullrequests;
            this.setFilteredPullrequests(pullrequests.filter((pullrequest) => {
                if (pullrequest.repo.name === searchString) {
                    return true;
                } else {
                    return false;
                }
            }));
            this.setFilteredPullrequestsSearch(searchString);
        },

        async refreshSummary(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            let query = rootState.pullrequestsView.query;
            let openedPullrequestsFilter = {...query, ...{'state':{$in:['OPEN']}}};
            let openedPullrequests = cfgPullrequests.find(openedPullrequestsFilter).fetch();

            let repos = [];
            let statesGroup = _.groupBy(openedPullrequests, 'repo.name');
            Object.keys(statesGroup).forEach(function(key) {
                repos.push({
                    count: statesGroup[key].length,
                    name: key,
                    pullrequests: statesGroup[key],
                    points: statesGroup[key].map(i => i.points).reduce((acc, points) => acc + points, 0)
                });
            });
            this.setRemainingWorkRepos(repos);
            this.setRemainingWorkPoints(repos.map(r => r.points).reduce((acc, points) => acc + points, 0));
            this.setRemainingWorkCount(repos.map(r => r.pullrequests.length).reduce((acc, count) => acc + count, 0));

            var t1 = performance.now();
            log.info("refreshSummary - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshFacets(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            let updatedFacets = buildFacets(JSON.parse(JSON.stringify(rootState.pullrequestsView.query)), cfgPullrequests);
            this.setFacets(updatedFacets);

            var t1 = performance.now();
            log.info("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshBurndown(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            this.setShouldBurndownDataReload(false);

            let burndownData = await refreshBurndown(JSON.parse(JSON.stringify(rootState.pullrequestsView.query)), cfgPullrequests);

            this.setBurndown(burndownData);

            var t1 = performance.now();
            log.info("refreshBurndown - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshVelocity(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            this.setShouldVelocityDataReload(false);

            let velocityData = await refreshVelocity(JSON.parse(JSON.stringify(rootState.pullrequestsView.query)), cfgPullrequests);

            this.setVelocity(velocityData);

            var t1 = performance.now();
            log.info("refreshVelocity - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshBins(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.pullrequestsView.query;

            const openedDuring = [{
                label: '0 - 1 day',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gte :  0, $lte : 1}}}).fetch()
            }, {
                label: '1 - 7 days',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  1, $lte : 7}}}).fetch()
            }, {
                label: '1 - 2 weeks',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  7, $lte : 14}}}).fetch()
            }, {
                label: '2 - 4 weeks',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  14, $lte : 30}}}).fetch()
            }, {
                label: '1 - 3 months',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  30, $lte : 90}}}).fetch()
            }, {
                label: '3 - 6 months',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  90, $lte : 120}}}).fetch()
            }, {
                label: '6 - 12 months',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gte :  120, $lte : 365}}}).fetch()
            }, {
                label: '1 year or more',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  365}}}).fetch()
            }];
            this.setStatsOpenedDuring(openedDuring);

            const createdSince = [{
                label: '0 - 1 day',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['OPEN']}, 'stats.createdSince':{ $gte :  0, $lte : 1}}}).fetch()
            }, {
                label: '1 - 7 days',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['OPEN']}, 'stats.createdSince':{ $gt :  1, $lte : 7}}}).fetch()
            }, {
                label: '1 - 2 weeks',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['OPEN']}, 'stats.createdSince':{ $gt :  7, $lte : 14}}}).fetch()
            }, {
                label: '2 - 4 weeks',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['OPEN']}, 'stats.createdSince':{ $gt :  14, $lte : 30}}}).fetch()
            }, {
                label: '1 - 3 months',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['OPEN']}, 'stats.createdSince':{ $gt :  30, $lte : 90}}}).fetch()
            }, {
                label: '3 - 6 months',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['OPEN']}, 'stats.createdSince':{ $gt :  90, $lte : 120}}}).fetch()
            }, {
                label: '6 - 12 months',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['OPEN']}, 'stats.createdSince':{ $gte :  120, $lte : 365}}}).fetch()
            }, {
                label: '1 year or more',
                pullrequests: cfgPullrequests.find({...query, ...{'state':{$in:['OPEN']}, 'stats.createdSince':{ $gt :  365}}}).fetch()
            }];
            this.setStatsCreatedSince(createdSince);

            var t1 = performance.now();
            log.info("refreshBins - took " + (t1 - t0) + " milliseconds.");
        },

    }
};
