import _ from 'lodash';

import { cfgIssues, cfgQueries, cfgSources } from '../../../data/Minimongo.js';

import { refreshBurndown } from '../../../utils/burndown/index.js';
import { buildFacets } from '../../../utils/facets/repositories.js';
import { refreshVelocity } from '../../../utils/velocity/index.js';

import { getAssigneesRepartition } from '../../../utils/repartition/index.js';

import subDays from 'date-fns/subDays';

export default {
    state: {
        repositories: [],
        repositoriesTotalCount: 0,
        repositoriesTotalGitHubCount: 0,
        repositoriesFirstUpdate: {},
        repositoriesLastUpdate: {},

        filteredRepositories: [],
        filteredRepositoriesSearch: '',
        facets: [],
        queries: [],

        selectedTab: 'stats',           // Selected tab to be displayed
        tabStatsQuery: null,            // This stores the current query, used to identify if data refresh is needed
        tabWorkQuery: null,             // This stores the current query, used to identify if data refresh is needed
        tabGraphQuery: null,            // This stores the current query, used to identify if data refresh is needed

        query: {},

        defaultPoints: false,    // Default display to points, otherwise repositories count

        burndown: {},
        shouldBurndownDataReload: false,  // We don't want to reload the burndown data automatically when repositories are changed

        velocity: {},
        shouldVelocityDataReload: false,  // We don't want to reload the velocity data automatically when repositories are changed

        remainingWorkRepos: [],                  // List repos with open repositories
        remainingWorkAssignees: [],              // List assignees with open repositories
        shouldSummaryDataReload: false,

        statsCreatedSince: [],
        statsUpdatedSince: [],
        statsPushedSince: [],

        statsIssuesPresent: [],
        statsPullRequestsPresent: [],
        statsReleasesPresent: [],
        statsProjectsPresent: [],
        statsMilestonesPresent: [],
        statsBranchProtectionPresent: [],

        showTimeModal: false,
        timeFields: [{idx: 'createdAt', name: 'Created'}, {idx: 'updatedAt', name: 'Updated'}, {idx: 'pushedAt', name: 'Pushed'}],
    },
    reducers: {
        setRepositories(state, payload) {return { ...state, repositories: payload };},
        setRepositoriesTotalCount(state, payload) {return { ...state, repositoriesTotalCount: payload };},
        setRepositoriesTotalGitHubCount(state, payload) {return { ...state, repositoriesTotalGitHubCount: payload };},
        setRepositoriesFirstUpdate(state, payload) {return { ...state, repositoriesFirstUpdate: JSON.parse(JSON.stringify(payload)) };},
        setRepositoriesLastUpdate(state, payload) {return { ...state, repositoriesLastUpdate: JSON.parse(JSON.stringify(payload)) };},
        setRepositoriesGraph(state, payload) {return { ...state, repositoriesGraph: payload };},

        setFilteredRepositories(state, payload) {return { ...state, filteredRepositories: payload };},
        setFilteredRepositoriesSearch(state, payload) {return { ...state, filteredRepositoriesSearch: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},
        setQueries(state, payload) {return { ...state, queries: payload };},
        setSelectedTab(state, payload) {return { ...state, selectedTab: payload };},
        setTabStatsQuery(state, payload) {return { ...state, tabStatsQuery: payload };},
        setTabWorkQuery(state, payload) {return { ...state, tabWorkQuery: payload };},
        setTabGraphQuery(state, payload) {return { ...state, tabGraphQuery: payload };},

        setQuery(state, payload) {return { ...state, query: JSON.parse(JSON.stringify(payload)) };},

        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},

        setShouldBurndownDataReload(state, payload) {return { ...state, shouldBurndownDataReload: payload };},
        setBurndown(state, payload) {return { ...state, burndown: JSON.parse(JSON.stringify(payload)) };},

        setShouldVelocityDataReload(state, payload) {return { ...state, shouldVelocityDataReload: payload };},
        setVelocity(state, payload) {return { ...state, velocity: JSON.parse(JSON.stringify(payload)) };},

        setShouldSummaryDataReload(state, payload) {return { ...state, shouldSummaryDataReload: payload };},
        setRemainingWorkRepos(state, payload) {return { ...state, remainingWorkRepos: payload };},
        setRemainingWorkAssignees(state, payload) {return { ...state, remainingWorkAssignees: payload };},

        setStatsCreatedSince(state, payload) {return { ...state, statsCreatedSince: payload };},
        setStatsUpdatedSince(state, payload) {return { ...state, statsUpdatedSince: payload };},
        setStatsPushedSince(state, payload) {return { ...state, statsPushedSince: payload };},
        setStatsIssuesPresent(state, payload) {return { ...state, statsIssuesPresent: payload };},
        setStatsPullRequestsPresent(state, payload) {return { ...state, statsPullRequestsPresent: payload };},
        setStatsReleasesPresent(state, payload) {return { ...state, statsReleasesPresent: payload };},
        setStatsProjectsPresent(state, payload) {return { ...state, statsProjectsPresent: payload };},
        setStatsMilestonesPresent(state, payload) {return { ...state, statsMilestonesPresent: payload };},
        setStatsBranchProtectionPresent(state, payload) {return { ...state, statsBranchProtectionPresent: payload };},

        setShowTimeModal(state, payload) {return { ...state, showTimeModal: payload };},
        setTimeFields(state, payload) {return { ...state, timeFields: payload };},
    },
    effects: {
        async updateQuery(query) {
            if (query === null) {
                this.setQuery({});
            } else {
                this.setQuery(query);
            }
            this.updateView();
        },

        async clearIssues() {
            cfgSources.remove({});
            this.setRepositories([]);
            this.setQuery({});
            this.updateView();
        },

        async updateView(payload, rootState) {
            const log = rootState.global.log;
            log.info("Triggered updateView()");

            this.refreshQueries();
            this.refreshFacets();
            this.refreshRepositories();

            this.updateStats();
            this.updateWork();
        },

        async updateSelectedTab(payload, rootState) {
            const log = rootState.global.log;
            log.info("Triggered updateSelectedTab() - " + payload);
            this.setSelectedTab(payload);
            if (payload === 'stats' && !_.isEqual(rootState.repositoriesView.query, rootState.repositoriesView.tabStatsQuery)) {
                this.updateStats();
            }
        },

        async updateStats(payload, rootState) {
            if (rootState.repositoriesView.selectedTab === 'stats') {
                this.refreshBins();
                this.refreshIssuesPresent();
                this.refreshPullRequestsPresent();
                this.refreshReleasesPresent();
                this.refreshProjectsPresent();
                this.refreshMilestonesPresent();
                this.refreshBranchProtectionPresent();
                this.setTabStatsQuery(rootState.repositoriesView.query);
            }
        },

        async updateWork(payload, rootState) {
            if (rootState.repositoriesView.selectedTab === 'work' || rootState.repositoriesView.selectedTab === 'burndown' || rootState.repositoriesView.selectedTab === 'velocity') {
                this.setShouldBurndownDataReload(true);
                this.refreshSummary();
                this.refreshVelocity();
                this.setTabWorkQuery(rootState.repositoriesView.query);
            }
        },

        async refreshQueries() {
            this.setQueries(cfgQueries.find({}).fetch());
        },

        async saveQuery(queryName, rootState) {
            if (cfgQueries.find({filters: JSON.stringify(rootState.repositoriesView.query)}).count() === 0) {
                await cfgQueries.insert({
                    name: queryName,
                    filters: JSON.stringify(rootState.repositoriesView.query),
                });
            }
            this.refreshQueries();
        },

        async refreshRepositories(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            
            let repositories = cfgSources.find(rootState.repositoriesView.query).fetch();
            const firstUpdate = cfgSources.findOne(rootState.repositoriesView.query, {sort: {updatedAt: 1},reactive: false,transform: null});
            const lastUpdate = cfgSources.findOne(rootState.repositoriesView.query, {sort: {updatedAt: -1},reactive: false,transform: null});

            if (repositories.length > 0) {
                this.setRepositoriesFirstUpdate(firstUpdate);
                this.setRepositoriesLastUpdate(lastUpdate);
            }
            this.setRepositoriesTotalCount(cfgSources.find({}).count());

            this.setRepositories(repositories);
            this.setFilteredRepositories(repositories);
            this.setFilteredRepositoriesSearch('');
            var t1 = performance.now();
            log.info("refreshRepositories - took " + (t1 - t0) + " milliseconds.");
        },

        async searchIssues(searchString, rootState) {
            let repositories = rootState.repositoriesView.repositories;
            this.setFilteredRepositories(repositories.filter((issue) => {
                if (issue.repo.name === searchString) {
                    return true;
                } else {
                    return false;
                }
            }));
            this.setFilteredRepositoriesSearch(searchString);
        },

        async refreshSummary(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            let query = rootState.repositoriesView.query;
            let openedIssuesFilter = {...query, ...{'state':{$in:['OPEN']}}};
            let openedIssues = cfgIssues.find(openedIssuesFilter).fetch();

            let repos = [];
            let statesGroup = _.groupBy(openedIssues, 'repo.name');
            Object.keys(statesGroup).forEach(function(key) {
                repos.push({
                    count: statesGroup[key].length,
                    name: key,
                    repositories: statesGroup[key],
                    points: statesGroup[key].map(i => i.points).reduce((acc, points) => acc + points, 0)
                });
            });
            this.setRemainingWorkRepos(repos);

            const assignees = getAssigneesRepartition(openedIssues).map((assignee) => {
                let name = assignee.login;
                if (assignee.name !== undefined && assignee.name !== '' && assignee.name !== null) {name = assignee.name;}
                return {
                    name: name,
                    count: assignee.repositories.list.length,
                    points: assignee.repositories.points,
                    repositories: assignee.repositories.list,
                }
            });
            this.setRemainingWorkAssignees(assignees);

            var t1 = performance.now();
            log.info("refreshSummary - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshFacets(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            let updatedFacets = buildFacets(JSON.parse(JSON.stringify(rootState.repositoriesView.query)), cfgSources);
            this.setFacets(updatedFacets);

            var t1 = performance.now();
            log.info("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshBurndown(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            this.setShouldBurndownDataReload(false);

            let burndownData = await refreshBurndown(JSON.parse(JSON.stringify(rootState.repositoriesView.query)), cfgIssues);

            this.setBurndown(burndownData);

            var t1 = performance.now();
            log.info("refreshBurndown - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshVelocity(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            this.setShouldVelocityDataReload(false);

            let velocityData = await refreshVelocity(JSON.parse(JSON.stringify(rootState.repositoriesView.query)), cfgIssues);

            this.setVelocity(velocityData);

            var t1 = performance.now();
            log.info("refreshVelocity - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshBins(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.repositoriesView.query;

            const createdSince = [{
                label: '0 - 1 d',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt : subDays(new Date(), 1).toISOString()}}).fetch()
            }, {
                label: '1 - 7 d',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 7).toISOString(), $lte : subDays(new Date(), 1).toISOString()}}).fetch()
            }, {
                label: '1 - 2 wks',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 14).toISOString(), $lte : subDays(new Date(), 7).toISOString()}}).fetch()
            }, {
                label: '2 - 4 wks',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 30).toISOString(), $lte : subDays(new Date(), 14).toISOString()}}).fetch()
            }, {
                label: '1 - 3 mths',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 90).toISOString(), $lte : subDays(new Date(), 30).toISOString()}}).fetch()
            }, {
                label: '3 - 6 mths',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 120).toISOString(), $lte : subDays(new Date(), 90).toISOString()}}).fetch()
            }, {
                label: '6 - 12 mths',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 365).toISOString(), $lte : subDays(new Date(), 120).toISOString()}}).fetch()
            }, {
                label: '1 - 2 yrs',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 730).toISOString(), $lte : subDays(new Date(), 365).toISOString()}}).fetch()
            }, {     
                label: '2 - 3 yrs',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 1095).toISOString(), $lte : subDays(new Date(), 730).toISOString()}}).fetch()
            }, {                             
                label: '3 - 4 yrs',
                repositories: cfgSources.find({...query, 'createdAt':{ $gt :  subDays(new Date(), 1460).toISOString(), $lte : subDays(new Date(), 1095).toISOString()}}).fetch()
            }, {
                label: '4 yr+',
                repositories: cfgSources.find({...query, 'createdAt':{ $lt :  subDays(new Date(), 1460).toISOString()}}).fetch()    
            }];
            this.setStatsCreatedSince(createdSince);

            const updatedSince = [{
                label: '0 - 1 d',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt : subDays(new Date(), 1).toISOString()}}).fetch()
            }, {
                label: '1 - 7 d',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 7).toISOString(), $lte : subDays(new Date(), 1).toISOString()}}).fetch()
            }, {
                label: '1 - 2 wks',
                repositories: cfgIssues.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 14).toISOString(), $lte : subDays(new Date(), 7).toISOString()}}).fetch()
            }, {
                label: '2 - 4 wks',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 30).toISOString(), $lte : subDays(new Date(), 14).toISOString()}}).fetch()
            }, {
                label: '1 - 3 mths',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 90).toISOString(), $lte : subDays(new Date(), 30).toISOString()}}).fetch()
            }, {
                label: '3 - 6 mths',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 120).toISOString(), $lte : subDays(new Date(), 90).toISOString()}}).fetch()
            }, {
                label: '6 - 12 mths',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 365).toISOString(), $lte : subDays(new Date(), 120).toISOString()}}).fetch()
            }, {
                label: '1 - 2 yrs',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 730).toISOString(), $lte : subDays(new Date(), 365).toISOString()}}).fetch()
            }, {     
                label: '2 - 3 yrs',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 1095).toISOString(), $lte : subDays(new Date(), 730).toISOString()}}).fetch()
            }, {                             
                label: '3 - 4 yrs',
                repositories: cfgSources.find({...query, 'updatedAt':{ $gt :  subDays(new Date(), 1460).toISOString(), $lte : subDays(new Date(), 1095).toISOString()}}).fetch()
            }, {
                label: '4 yr+',
                repositories: cfgSources.find({...query, 'updatedAt':{ $lt :  subDays(new Date(), 1460).toISOString()}}).fetch()
            }];
            this.setStatsUpdatedSince(updatedSince);

            const pushedSince = [{
                label: '0 - 1 d',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt : subDays(new Date(), 1).toISOString()}}).fetch()
            }, {
                label: '1 - 7 d',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 7).toISOString(), $lte : subDays(new Date(), 1).toISOString()}}).fetch()
            }, {
                label: '1 - 2 wks',
                repositories: cfgIssues.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 14).toISOString(), $lte : subDays(new Date(), 7).toISOString()}}).fetch()
            }, {
                label: '2 - 4 wks',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 30).toISOString(), $lte : subDays(new Date(), 14).toISOString()}}).fetch()
            }, {
                label: '1 - 3 mths',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 90).toISOString(), $lte : subDays(new Date(), 30).toISOString()}}).fetch()
            }, {
                label: '3 - 6 mths',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 120).toISOString(), $lte : subDays(new Date(), 90).toISOString()}}).fetch()
            }, {
                label: '6 - 12 mths',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 365).toISOString(), $lte : subDays(new Date(), 120).toISOString()}}).fetch()
            }, {
                label: '1 - 2 yrs',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 730).toISOString(), $lte : subDays(new Date(), 365).toISOString()}}).fetch()
            }, {     
                label: '2 - 3 yrs',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 1095).toISOString(), $lte : subDays(new Date(), 730).toISOString()}}).fetch()
            }, {                             
                label: '3 - 4 yrs',
                repositories: cfgSources.find({...query, 'pushedAt':{ $gt :  subDays(new Date(), 1460).toISOString(), $lte : subDays(new Date(), 1095).toISOString()}}).fetch()
            }, {
                label: '4 yr+',
                repositories: cfgSources.find({...query, 'pushedAt':{ $lt :  subDays(new Date(), 1460).toISOString()}}).fetch()                
            }];
            this.setStatsPushedSince(pushedSince);            

            var t1 = performance.now();
            log.info("refreshBins - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshIssuesPresent(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.repositoriesView.query;

            const issuesPresent = [{
                name: 'Populated',
                color: '#2196f3',
                repositories: cfgSources.find({...query, ...{'issues.totalCount':{ $gt : 0}}}).fetch()
            }, {
                name: 'Empty',
                color: '#e0e0e0',
                repositories: cfgSources.find({...query, ...{'issues.totalCount':{ $eq : 0}}}).fetch()
            }];
            this.setStatsIssuesPresent(issuesPresent);

            var t1 = performance.now();
            log.info("refreshIssuesPresent - took " + (t1 - t0) + " milliseconds.");
        },

        async refreshPullRequestsPresent(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.repositoriesView.query;

            const isPresent = [{
                name: 'Populated',
                color: '#2196f3',
                repositories: cfgSources.find({...query, ...{'pullRequests.totalCount':{ $gt : 0}}}).fetch()
            }, {
                name: 'Empty',
                color: '#e0e0e0',
                repositories: cfgSources.find({...query, ...{'pullRequests.totalCount':{ $eq : 0}}}).fetch()
            }];
            this.setStatsPullRequestsPresent(isPresent);

            var t1 = performance.now();
            log.info("refreshPullRequestsPresent - took " + (t1 - t0) + " milliseconds.");
        },        

        async refreshReleasesPresent(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.repositoriesView.query;

            const isPresent = [{
                name: 'Populated',
                color: '#2196f3',
                repositories: cfgSources.find({...query, ...{'releases.totalCount':{ $gt : 0}}}).fetch()
            }, {
                name: 'Empty',
                color: '#e0e0e0',
                repositories: cfgSources.find({...query, ...{'releases.totalCount':{ $eq : 0}}}).fetch()
            }];
            this.setStatsReleasesPresent(isPresent);

            var t1 = performance.now();
            log.info("refreshReleasesPresent - took " + (t1 - t0) + " milliseconds.");
        },  

        async refreshProjectsPresent(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.repositoriesView.query;

            const isPresent = [{
                name: 'Populated',
                color: '#2196f3',
                repositories: cfgSources.find({...query, ...{'projects.totalCount':{ $gt : 0}}}).fetch()
            }, {
                name: 'Empty',
                color: '#e0e0e0',
                repositories: cfgSources.find({...query, ...{'projects.totalCount':{ $eq : 0}}}).fetch()
            }];
            this.setStatsProjectsPresent(isPresent);

            var t1 = performance.now();
            log.info("refreshProjectsPresent - took " + (t1 - t0) + " milliseconds.");
        },          

        async refreshMilestonesPresent(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.repositoriesView.query;

            const isPresent = [{
                name: 'Populated',
                color: '#2196f3',
                repositories: cfgSources.find({...query, ...{'milestones.totalCount':{ $gt : 0}}}).fetch()
            }, {
                name: 'Empty',
                color: '#e0e0e0',
                repositories: cfgSources.find({...query, ...{'milestones.totalCount':{ $eq : 0}}}).fetch()
            }];
            this.setStatsMilestonesPresent(isPresent);

            var t1 = performance.now();
            log.info("refreshMilestonesPresent - took " + (t1 - t0) + " milliseconds.");
        },   

        async refreshBranchProtectionPresent(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();
            const query = rootState.repositoriesView.query;

            const isPresent = [{
                name: 'Populated',
                color: '#2196f3',
                repositories: cfgSources.find({...query, ...{'branchProtectionRules.totalCount':{ $gt : 0}}}).fetch()
            }, {
                name: 'Empty',
                color: '#e0e0e0',
                repositories: cfgSources.find({...query, ...{'branchProtectionRules.totalCount':{ $eq : 0}}}).fetch()
            }];
            this.setStatsBranchProtectionPresent(isPresent);

            var t1 = performance.now();
            log.info("refreshMilestonesPresent - took " + (t1 - t0) + " milliseconds.");
        },       
    }
};
