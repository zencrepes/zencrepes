import _ from 'lodash';

import { cfgMilestones, cfgIssues, cfgSources } from "../../../data/Minimongo.js";

import {
    getAssigneesRepartition,
//    getMilestonesRepartition,
//    getAssignees,
    getRepositories,
//    getRepositoriesRepartition,
    getLabelsRepartition,
//    getColumnsRepartition,
} from "../../../utils/repartition/index.js";

import {
    getFirstDay,
    getLastDay,
    initObject,
    populateClosed,
    populateObject,
    populateOpen,
    populateTicketsPerDay,
    populateTicketsPerWeek
} from "../../../utils/velocity/index.js";

import {
    refreshBurndown,
} from "../../../utils/sprintburn/index.js";

export default {
    state: {
        query: {},
        projects: [],                       // Array of projects
        projectsIssues: [],                 // Array of projects issues, project issues are used to link the project to a milestone as well as to define team members
        sprints: [],
        showClosed: false,
        selectedMilestoneId: 'no-filter',
        selectedSprintLabel: 'no-filter',
        selectedSprintDescription: null,
        selectedSprintDueDate: null,

        defaultPoints: true,                // Default display to points, otherwise issues count

        assignees: [],
        assigneesRemaining: [],
        availableAssignees: [],
        filteredAvailableAssignees: [],
        availableAssigneesFilter: '',
        openAddAssignee: false,

        repositories: [],
        availableRepositories: [],
        filteredAvailableRepositories: [],
        availableRepositoryFilter: '',
        openAddRepository: false,
        addReposAvailable: [],
        addReposSelected: [],
        allRepos: [],           //All repos, unfiltered

        labels: [],

        issues: [],

        milestones: [],
        columns: [],                      // Breakdown of issues by columns

        velocity: {},
        velocityTeam: false,            // Velocity based only on team members
        burndown: {},

        autoRefreshEnable: false,       // Enable auto-refresh of repository issues
        autoRefreshTimer: 120,            // Time between auto-refresh
        autoRefreshCount: 0,            // Auto-refresh count
        autoRefreshMaxCount: 20,        // Maximum number of times to auto-refresh
        autoRefreshDefaultTimer: 120,   // Default timer

        agileBoardData: {},
        agileBoardLabels: [],

        filterLabelsAvailable: [],
        filterLabelsSelected: [],
    },

    reducers: {
        setQuery(state, payload) {return { ...state, query: JSON.parse(JSON.stringify(payload)) };},
        setProjects(state, payload) {return { ...state, projects: JSON.parse(JSON.stringify(payload)) };},
        setProjectsIssues(state, payload) {return { ...state, projectsIssues: JSON.parse(JSON.stringify(payload)) };},

        setSprints(state, payload) {return { ...state, sprints: payload };},
        setShowClosed(state, payload) {return { ...state, showClosed: payload };},
        setSelectedMilestoneId(state, payload) {return { ...state, selectedMilestoneId: payload };},
        setSelectedSprintLabel(state, payload) {return { ...state, selectedSprintLabel: payload };},
        setSelectedSprintDescription(state, payload) {return { ...state, selectedSprintDescription: payload };},
        setSelectedSprintDueDate(state, payload) {return { ...state, selectedSprintDueDate: payload };},

        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},

        setAssignees(state, payload) {return { ...state, assignees: JSON.parse(JSON.stringify(payload)) };},
        setAssigneesRemaining(state, payload) {return { ...state, assigneesRemaining: JSON.parse(JSON.stringify(payload)) };},
        setOpenAddAssignee(state, payload) {return { ...state, openAddAssignee: payload };},
        setAvailableAssignees(state, payload) {return { ...state, availableAssignees: JSON.parse(JSON.stringify(payload))};},
        setFilteredAvailableAssignees(state, payload) {return { ...state, filteredAvailableAssignees: JSON.parse(JSON.stringify(payload)) };},
        setAvailableAssigneesFilter(state, payload) {return { ...state, availableAssigneesFilter: payload };},

        setRepositories(state, payload) {return { ...state, repositories: JSON.parse(JSON.stringify(payload)) };},
        setOpenAddRepository(state, payload) {return { ...state, openAddRepository: payload };},
        setAvailableRepositories(state, payload) {return { ...state, availableRepositories: JSON.parse(JSON.stringify(payload))};},
        setFilteredAvailableRepositories(state, payload) {return { ...state, filteredAvailableRepositories: JSON.parse(JSON.stringify(payload)) };},
        setAvailableRepositoriesFilter(state, payload) {return { ...state, availableRepositoriesFilter: payload };},

        setAddReposAvailable(state, payload) {return { ...state, addReposAvailable: payload };},
        setAddReposSelected(state, payload) {return { ...state, addReposSelected: payload };},
        setAllRepos(state, payload) {return { ...state, allRepos: payload };},

        setIssues(state, payload) {return { ...state, issues: JSON.parse(JSON.stringify(payload)) };},

        setMilestones(state, payload) {return { ...state, milestones: JSON.parse(JSON.stringify(payload)) };},
        setColumns(state, payload) {return { ...state, columns: JSON.parse(JSON.stringify(payload)) };},

        setVelocity(state, payload) {return { ...state, velocity: payload };},
        setVelocityTeam(state, payload) {return { ...state, velocityTeam: payload };},

        setBurndown(state, payload) {return { ...state, burndown: payload };},

        setLabels(state, payload) {return { ...state, labels: payload };},

        setAutoRefreshEnable(state, payload) {return { ...state, autoRefreshEnable: payload };},
        setAutoRefreshTimer(state, payload) {return { ...state, autoRefreshTimer: payload };},
        setAutoRefreshCount(state, payload) {return { ...state, autoRefreshCount: payload };},
        setAutoRefreshMaxCount(state, payload) {return { ...state, autoRefreshMaxCount: payload };},

        setAgileBoardData(state, payload) {return { ...state, agileBoardData: JSON.parse(JSON.stringify(payload)) };},
        setAgileBoardLabels(state, payload) {return { ...state, agileBoardLabels: payload };},

        setFilterLabelsAvailable(state, payload) {return { ...state, filterLabelsAvailable: payload };},
        setFilterLabelsSelected(state, payload) {return { ...state, filterLabelsSelected: payload };},
    },
    effects: {
        async updateQuery(query) {
            this.setQuery(query);
            this.updateMilestones();

            this.updateView();
        },

        //From the query, get the list of milestones.
        async updateMilestones(payload, rootState) {
            let repositories = getRepositories(cfgIssues.find(rootState.milestoneView.query).fetch());
            this.setRepositories(repositories);

            let milestonesQuery = {...rootState.milestoneView.query};
            if (milestonesQuery['milestone.id'] !== undefined) {
                delete milestonesQuery['milestone.id'];
            }

            const milestoneTitle = cfgIssues.findOne(rootState.milestoneView.query).milestone.title;

            let repositoriesNoFilter = getRepositories(cfgIssues.find(milestonesQuery).fetch());
            let milestonesSelect = repositoriesNoFilter.map((repo) => {
                return {
                    id: repo.issues.list[0].milestone.id,
                    name: milestoneTitle + ' in ' + repo.org.login + '/' + repo.name + ' (' + repo.issues.count + ' issues)',
                }
            });
            milestonesSelect.unshift({id: 'no-filter', name: 'No Filter (all)'});
            this.setMilestones(milestonesSelect);
        },

        async updateShowClosed(showClosed) {
            let milestonesQuery = {'state':{'$in':['OPEN']}};
            if (showClosed) {
                milestonesQuery = {};
            }
            const sprints = Object.keys(_.groupBy(cfgMilestones.find(milestonesQuery).fetch(), 'title')).sort();
            this.setSprints(sprints);
            this.setShowClosed(showClosed);
        },

        async updateView(payload, rootState) {
            const issues = cfgIssues.find(rootState.milestoneView.query).fetch();
            this.setIssues(issues);

            // If no issues have points, move to default by count.
            const issuesPoints = issues.filter(issue => issue.points !== null).length;
            if (issuesPoints === 0 && issues.length > 0) {
                this.setDefaultPoints(false);
            } else {
                this.setDefaultPoints(true);
            }

            let assignees = getAssigneesRepartition(cfgIssues.find(rootState.milestoneView.query).fetch());
            this.setAssignees(assignees);

            let openQuery = {...rootState.milestoneView.query, 'state': { $eq : 'OPEN' }};
            let assigneesRemaining = getAssigneesRepartition(cfgIssues.find(openQuery).fetch());
            this.setAssigneesRemaining(assigneesRemaining);

            this.updateVelocity(assignees);

            this.updateBurndown(rootState.milestoneView.query);

            let labels = getLabelsRepartition(cfgIssues.find(rootState.milestoneView.query).fetch());
            this.setLabels(labels);

            /*
            let milestones = getMilestonesRepartition(cfgIssues.find(rootState.milestoneView.query).fetch());
            this.setMilestones(milestones);
            */
/*
            let columns = getColumnsRepartition(cfgIssues.find(rootState.milestoneView.query).fetch(), rootState.milestoneView.projects[0].name);
            this.setColumns(columns);
*/
        },

        async initView() {
            this.refreshSprints();

            const allRepos = cfgSources.find({active: true}).fetch();
            this.setAllRepos(allRepos);

            this.updateView();
        },
        async refreshSprints() {
//            let sprints = Object.keys(_.groupBy(cfgMilestones.find({'state':{'$in':['OPEN']}}).fetch(), 'title')).sort();
//            let sprints = Object.keys(_.groupBy(cfgMilestones.find({}).fetch(), 'title')).sort();
//            this.setSprints(sprints);
//            this.updateSelectedSprint(sprints[0]);
        },

        async updateAvailableSprints() {
//            let sprints = Object.keys(_.groupBy(cfgMilestones.find({'state':{'$in':['OPEN']}}).fetch(), 'title')).sort();
//            let sprints = Object.keys(_.groupBy(cfgMilestones.find({}).fetch(), 'title')).sort();
//            this.setSprints(sprints);
        },

        async updateSelectedSprint(selectedSprintLabel) {
            await this.setSelectedSprintLabel(selectedSprintLabel);
            this.updateView();
        },

        async updateBurndown(currentSprintFilter, rootState) {
            const burndown = refreshBurndown(currentSprintFilter, cfgIssues, null, rootState.sprintsView.velocity);
            this.setBurndown(burndown);
        },

        async updateVelocityTeam(payload, rootState) {
            this.setVelocityTeam(payload);

            let assignees = rootState.milestoneView.assignees;
            if (payload === true) {
                assignees = assignees.filter(assignee => assignee.core === true);
            }
            this.updateVelocity(assignees);
        },

        async updateVelocity(assignees, rootState) {
            //Build velocity based on past assignees performance
            let currentSprintFilter = {...rootState.milestoneView.query, 'state': { $eq : 'OPEN' }};

            let assigneesLogin = assignees.map((assignee) => assignee.login);
            let closedIssuesFilter = {'state': { $eq : 'CLOSED' },'assignees.edges':{'$elemMatch':{'node.login':{'$in':assigneesLogin}}}};
            //let closedIssues = cfgIssues.find(closedIssuesFilter).fetch()

            let firstDay = getFirstDay(closedIssuesFilter, cfgIssues);
            let lastDay = getLastDay(closedIssuesFilter, cfgIssues);

            let dataObject = initObject(firstDay, lastDay); // Build an object of all days and weeks between two dates
            dataObject = populateObject(dataObject, cfgIssues.find(closedIssuesFilter).fetch()); // Populate the object with count of days and weeks
            dataObject = populateOpen(dataObject, cfgIssues.find(currentSprintFilter).fetch()); // Populate remaining issues count and remaining points
            dataObject = populateClosed(dataObject, cfgIssues.find(closedIssuesFilter).fetch()); // Populate closed issues count and points
            dataObject = populateTicketsPerDay(dataObject);
            dataObject = populateTicketsPerWeek(dataObject);

            this.setVelocity(dataObject);
        },

    }
};
