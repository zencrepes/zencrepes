import _ from 'lodash';

import { cfgIssues, cfgQueries } from '../../../data/Minimongo.js';

import { refreshBurndown } from '../../../utils/burndown/index.js';
import { buildFacets } from '../../../utils/facets/issues.js';
import { refreshVelocity } from '../../../utils/velocity/index.js';

import subDays from 'date-fns/subDays'

export default {
    state: {
        issues: [],
        filteredIssues: [],
        filteredIssuesSearch: '',
        facets: [],
        queries: [],

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

        statsOpenedDuring: [],
        statsCreatedSince: [],
        statsUpdatedSince: [],
        statsProjectsCount: [],
        statsMilestonesCount: [],
        statsPointsCount: [],
        statsAssigneesCount: [],

        showTimeModal: false,
        timeFields: [{idx: 'createdAt', name: 'Created'}, {idx: 'updatedAt', name: 'Updated'}, {idx: 'closedAt', name: 'Closed'}],
    },
    reducers: {
        setIssues(state, payload) {return { ...state, issues: payload };},
        setFilteredIssues(state, payload) {return { ...state, filteredIssues: payload };},
        setFilteredIssuesSearch(state, payload) {return { ...state, filteredIssuesSearch: payload };},
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
        setStatsUpdatedSince(state, payload) {return { ...state, statsUpdatedSince: payload };},
        setStatsProjectsCount(state, payload) {return { ...state, statsProjectsCount: payload };},
        setStatsMilestonesCount(state, payload) {return { ...state, statsMilestonesCount: payload };},
        setStatsPointsCount(state, payload) {return { ...state, statsPointsCount: payload };},
        setStatsAssigneesCount(state, payload) {return { ...state, statsAssigneesCount: payload };},

        setShowTimeModal(state, payload) {return { ...state, showTimeModal: payload };},
        setTimeFields(state, payload) {return { ...state, timeFields: payload };},
    },
    effects: {
        async updateQuery(query) {
            if (query === null) {this.setQuery({});}
            else {this.setQuery(query);}

            // Check if the query doesn't return any issues with points, set default back to issues count.
            const pointsQuery = {...query, points: {$gt: 0}};
            if (cfgIssues.find(pointsQuery).count() === 0) {this.setDefaultPoints(false);}

            this.updateView();
        },

        async clearIssues() {
            cfgIssues.remove({});
            this.setIssues([]);
            this.setQuery({});
            this.updateView();
        },

        async updateView() {
            this.refreshQueries();
            this.refreshFacets();
            this.refreshIssues();
            this.refreshBins();
            this.refreshProjects();
            this.refreshMilestones();
            this.refreshPoints();
            this.refreshAssignees();

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
            if (cfgQueries.find({filters: JSON.stringify(rootState.issuesView.query)}).count() === 0) {
                await cfgQueries.insert({
                    name: queryName,
                    filters: JSON.stringify(rootState.issuesView.query),
                });
            }
            this.refreshQueries();
        },

        async refreshIssues(payload, rootState) {
            let issues = cfgIssues.find(rootState.issuesView.query).fetch();
            this.setIssues(issues);
            this.setFilteredIssues(issues);
            this.setFilteredIssuesSearch('');
        },

        async searchIssues(searchString, rootState) {
            let issues = rootState.issuesView.issues;
            this.setFilteredIssues(issues.filter((issue) => {
                if (issue.repo.name === searchString) {
                    return true;
                } else {
                    return false;
                }
            }));
            this.setFilteredIssuesSearch(searchString);
        },

        async refreshSummary(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            let query = rootState.issuesView.query;
            let openedIssuesFilter = {...query, ...{'state':{$in:['OPEN']}}};
            let openedIssues = cfgIssues.find(openedIssuesFilter).fetch();

            let repos = [];
            let statesGroup = _.groupBy(openedIssues, 'repo.name');
            Object.keys(statesGroup).forEach(function(key) {
                repos.push({
                    count: statesGroup[key].length,
                    name: key,
                    issues: statesGroup[key],
                    points: statesGroup[key].map(i => i.points).reduce((acc, points) => acc + points, 0)
                });
            });
            this.setRemainingWorkRepos(repos);
            this.setRemainingWorkPoints(repos.map(r => r.points).reduce((acc, points) => acc + points, 0));
            this.setRemainingWorkCount(repos.map(r => r.issues.length).reduce((acc, count) => acc + count, 0));

            var t1 = performance.now();
            log.info("refreshSummary - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshFacets(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            let updatedFacets = buildFacets(JSON.parse(JSON.stringify(rootState.issuesView.query)), cfgIssues);
            this.setFacets(updatedFacets);

            var t1 = performance.now();
            log.info("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshBurndown(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            this.setShouldBurndownDataReload(false);

            let burndownData = await refreshBurndown(JSON.parse(JSON.stringify(rootState.issuesView.query)), cfgIssues);

            this.setBurndown(burndownData);

            var t1 = performance.now();
            log.info("refreshBurndown - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshVelocity(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            this.setShouldVelocityDataReload(false);

            let velocityData = await refreshVelocity(JSON.parse(JSON.stringify(rootState.issuesView.query)), cfgIssues);

            this.setVelocity(velocityData);

            var t1 = performance.now();
            log.info("refreshVelocity - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshBins(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.issuesView.query;

            const openedDuring = [{
                label: '0 - 1 day',
                issues: cfgIssues.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gte :  0, $lte : 1}}}).fetch()
            }, {
                label: '1 - 7 days',
                issues: cfgIssues.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  1, $lte : 7}}}).fetch()
            }, {
                label: '1 - 2 weeks',
                issues: cfgIssues.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  7, $lte : 14}}}).fetch()
            }, {
                label: '2 - 4 weeks',
                issues: cfgIssues.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  14, $lte : 30}}}).fetch()
            }, {
                label: '1 - 3 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  30, $lte : 90}}}).fetch()
            }, {
                label: '3 - 6 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  90, $lte : 120}}}).fetch()
            }, {
                label: '6 - 12 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gte :  120, $lte : 365}}}).fetch()
            }, {
                label: '1 year or more',
                issues: cfgIssues.find({...query, ...{'state':{$in:['CLOSED']}, 'stats.openedDuring':{ $gt :  365}}}).fetch()
            }];
            this.setStatsOpenedDuring(openedDuring);

            const createdSince = [{
                label: '0 - 1 day',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'createdAt':{ $gt : subDays(new Date(), 1).toISOString()}}}).fetch()
            }, {
                label: '1 - 7 days',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'createdAt':{ $gt :  subDays(new Date(), 7).toISOString(), $lte : subDays(new Date(), 1).toISOString()}}}).fetch()
            }, {
                label: '1 - 2 weeks',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'createdAt':{ $gt :  subDays(new Date(), 14).toISOString(), $lte : subDays(new Date(), 7).toISOString()}}}).fetch()
            }, {
                label: '2 - 4 weeks',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'createdAt':{ $gt :  subDays(new Date(), 30).toISOString(), $lte : subDays(new Date(), 14).toISOString()}}}).fetch()
            }, {
                label: '1 - 3 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'createdAt':{ $gt :  subDays(new Date(), 90).toISOString(), $lte : subDays(new Date(), 30).toISOString()}}}).fetch()
            }, {
                label: '3 - 6 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'createdAt':{ $gt :  subDays(new Date(), 120).toISOString(), $lte : subDays(new Date(), 90).toISOString()}}}).fetch()
            }, {
                label: '6 - 12 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'createdAt':{ $gt :  subDays(new Date(), 365).toISOString(), $lte : subDays(new Date(), 120).toISOString()}}}).fetch()
            }, {
                label: '1 year or more',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'createdAt':{ $lt :  subDays(new Date(), 365).toISOString()}}}).fetch()
            }];
            this.setStatsCreatedSince(createdSince);

            const updatedSince = [{
                label: '0 - 1 day',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'updatedAt':{ $gt : subDays(new Date(), 1).toISOString()}}}).fetch()
            }, {
                label: '1 - 7 days',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'updatedAt':{ $gt :  subDays(new Date(), 7).toISOString(), $lte : subDays(new Date(), 1).toISOString()}}}).fetch()
            }, {
                label: '1 - 2 weeks',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'updatedAt':{ $gt :  subDays(new Date(), 14).toISOString(), $lte : subDays(new Date(), 7).toISOString()}}}).fetch()
            }, {
                label: '2 - 4 weeks',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'updatedAt':{ $gt :  subDays(new Date(), 30).toISOString(), $lte : subDays(new Date(), 14).toISOString()}}}).fetch()
            }, {
                label: '1 - 3 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'updatedAt':{ $gt :  subDays(new Date(), 90).toISOString(), $lte : subDays(new Date(), 30).toISOString()}}}).fetch()
            }, {
                label: '3 - 6 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'updatedAt':{ $gt :  subDays(new Date(), 120).toISOString(), $lte : subDays(new Date(), 90).toISOString()}}}).fetch()
            }, {
                label: '6 - 12 months',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'updatedAt':{ $gt :  subDays(new Date(), 365).toISOString(), $lte : subDays(new Date(), 120).toISOString()}}}).fetch()
            }, {
                label: '1 year or more',
                issues: cfgIssues.find({...query, ...{'state':{$in:['OPEN']}, 'updatedAt':{ $lt :  subDays(new Date(), 365).toISOString()}}}).fetch()
            }];
            this.setStatsUpdatedSince(updatedSince);

            var t1 = performance.now();
            log.info("refreshBins - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshProjects(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.issuesView.query;

            const projectsCount = [{
                name: 'Empty',
                color: '#e0e0e0',
                issues: cfgIssues.find({...query, ...{'projectCards.totalCount':{ $eq : 0}}}).fetch()
            }, {
                name: 'Populated',
                color: '#2196f3',
                issues: cfgIssues.find({...query, ...{'projectCards.totalCount':{ $gt : 0}}}).fetch()
            }];
            this.setStatsProjectsCount(projectsCount);

            var t1 = performance.now();
            log.info("refreshProjects - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshMilestones(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.issuesView.query;

            const milestonesCount = [{
                name: 'Empty',
                color: '#e0e0e0',
                issues: cfgIssues.find({...query, ...{'milestone':null}}).fetch()
            }, {
                name: 'Populated',
                color: '#2196f3',
                issues: cfgIssues.find({...query, ...{'milestone':{ $ne : null}}}).fetch()
            }];
            this.setStatsMilestonesCount(milestonesCount);

            var t1 = performance.now();
            log.info("refreshMilestones - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshPoints(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.issuesView.query;

            const pointsCount = [{
                name: 'Empty',
                color: '#e0e0e0',
                issues: cfgIssues.find({...query, ...{'points':null}}).fetch()
            }, {
                name: 'Populated',
                color: '#2196f3',
                issues: cfgIssues.find({...query, ...{'points':{ $ne : null}}}).fetch()
            }];
            this.setStatsPointsCount(pointsCount);

            var t1 = performance.now();
            log.info("refreshPoints - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshAssignees(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.issuesView.query;

            const assigneesCount = [{
                name: 'Empty',
                color: '#e0e0e0',
                issues: cfgIssues.find({...query, ...{'assignees.totalCount':{ $eq : 0}}}).fetch()
            }, {
                name: 'Populated',
                color: '#2196f3',
                issues: cfgIssues.find({...query, ...{'assignees.totalCount':{ $gt : 0}}}).fetch()
            }];
            this.setStatsAssigneesCount(assigneesCount);

            var t1 = performance.now();
            log.info("refreshAssignees - took " + (t1 - t0) + " milliseconds.");
        },
    }
};
