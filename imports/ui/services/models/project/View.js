import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

import { cfgMilestones, cfgIssues, cfgSources, cfgProjects } from "../../../data/Minimongo.js";

import {
    getAssigneesRepartition,
    getMilestonesRepartition,
//    getAssignees,
//    getRepositories,
//    getRepositoriesRepartition,
    getLabelsRepartition,
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
        projects: [],
        sprints: [],
        showClosed: false,
        selectedSprintLabel: 'no-sprint',
        selectedSprintDescription: null,
        selectedSprintDueDate: null,

        defaultPoints: true,                // Default display to points, otherwise issues count

        assignees: [],
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

        velocity: {},
        burndown: {},

        autoRefreshEnable: false,       // Enable auto-refresh of repository issues
        autoRefreshTimer: 120,            // Time between auto-refresh
        autoRefreshCount: 0,            // Auto-refresh count
        autoRefreshMaxCount: 20,        // Maximum number of times to auto-refresh
        autoRefreshDefaultTimer: 120,   // Default timer

        agileBoardData: {},
        agileBoardLabels: [],
    },

    reducers: {
        setQuery(state, payload) {return { ...state, query: JSON.parse(JSON.stringify(payload)) };},
        setProjects(state, payload) {return { ...state, projects: JSON.parse(JSON.stringify(payload)) };},

        setSprints(state, payload) {return { ...state, sprints: payload };},
        setShowClosed(state, payload) {return { ...state, showClosed: payload };},
        setSelectedSprintLabel(state, payload) {return { ...state, selectedSprintLabel: payload };},
        setSelectedSprintDescription(state, payload) {return { ...state, selectedSprintDescription: payload };},
        setSelectedSprintDueDate(state, payload) {return { ...state, selectedSprintDueDate: payload };},

        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},

        setAssignees(state, payload) {return { ...state, assignees: JSON.parse(JSON.stringify(payload)) };},
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

        setVelocity(state, payload) {return { ...state, velocity: payload };},

        setBurndown(state, payload) {return { ...state, burndown: payload };},

        setLabels(state, payload) {return { ...state, labels: payload };},

        setAutoRefreshEnable(state, payload) {return { ...state, autoRefreshEnable: payload };},
        setAutoRefreshTimer(state, payload) {return { ...state, autoRefreshTimer: payload };},
        setAutoRefreshCount(state, payload) {return { ...state, autoRefreshCount: payload };},
        setAutoRefreshMaxCount(state, payload) {return { ...state, autoRefreshMaxCount: payload };},

        setAgileBoardData(state, payload) {return { ...state, agileBoardData: JSON.parse(JSON.stringify(payload)) };},
        setAgileBoardLabels(state, payload) {return { ...state, agileBoardLabels: payload };},
    },
    effects: {
        async updateQuery(query) {
            this.setQuery(query);
            this.updateProject();

            this.updateSprints();
            this.updateView();
        },

        async updateProject(payload, rootState) {
            //{"projectCards.edges":{"$elemMatch":{"node.project.name":{"$in":["Test%20Project%201"]}}}}
            const projectArray = _.get(rootState.projectView.query, ['projectCards.edges', '$elemMatch', 'node.project.name', '$in'], null);
            let identifiedProject = [];
            if (projectArray[0] !== undefined) {
                const projectName = projectArray[0];
                identifiedProject = cfgProjects.find({'name': projectName}).fetch();
            }
            if (rootState.projectView.projects[0] !== undefined && identifiedProject[0].name !== rootState.projectView.projects[0].name) {
                this.setSelectedSprintLabel('no-sprint');
                this.setSelectedSprintLabel('no-sprint');
            }
            this.setProjects(identifiedProject);
        },

        //Browse through all of the project's issues to fetch sprints values
        async updateSprints(payload, rootState) {
            //Go through all of the projects issues to find out if there are sprints.
            let sprintsValues = {};
            let projectQuery = {...rootState.projectView.query};
            if (projectQuery['labels.edges'] !== undefined) {
                delete projectQuery['labels.edges'];
            }

            cfgIssues.find(projectQuery).forEach((issue) => {
                issue.labels.edges.map((label) => {
                    let sprintLabelFilter = RegExp(Meteor.settings.public.sprint_prefix + '(.+)');
                    if (sprintLabelFilter.test(label.node.name)) {
                        if (sprintsValues[label.node.name] === undefined) {
                            sprintsValues[label.node.name] = {name: label.node.name, issues: 1, increment: label.node.name.replace(Meteor.settings.public.sprint_prefix, '')};
                        } else {
                            sprintsValues[label.node.name]['issues'] = sprintsValues[label.node.name]['issues'] + 1;
                        }
                    }
                });
            });
            sprintsValues = Object.values(sprintsValues);
            sprintsValues = sprintsValues.map((label) => {
                return {...label, display: label.name + ' (' + label.issues + ' issues)'}
            });

            // If one of the sprint label has a numerical value but gaps, the system will try to fill those.
            const sprintsNumIncrement = sprintsValues.filter(label => Number.isInteger(parseInt(label.increment))).map(label => parseInt(label.increment));
            if (sprintsNumIncrement.length > 0) {
                const highestSprint = Math.max(...sprintsNumIncrement);
                for (var i=0; i < highestSprint+2; i++) {
                    if (_.findIndex(sprintsValues, (label) => {return label.increment === String(i);}) === -1) {
                        let labelName = Meteor.settings.public.sprint_prefix + i;
                        sprintsValues.push({name: labelName, issues: 0, increment: i, display: labelName + ' (0 issues)'})
                    }
                }
            }
            sprintsValues = _.sortBy(sprintsValues, ['increment']);
            this.setSprints(sprintsValues);
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
            const issues = cfgIssues.find(rootState.projectView.query).fetch();
            this.setIssues(issues);

            // Create an array of assignees involved in a particular sprint
            let assignees = getAssigneesRepartition(cfgIssues.find(rootState.projectView.query).fetch());
            this.setAssignees(assignees);

            this.updateVelocity(assignees);
            this.updateBurndown(rootState.projectView.query);

            let labels = getLabelsRepartition(cfgIssues.find(rootState.projectView.query).fetch());
            this.setLabels(labels);

            let milestones = getMilestonesRepartition(cfgIssues.find(rootState.projectView.query).fetch());
            this.setMilestones(milestones);

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

        async updateVelocity(assignees, rootState) {
            //Build velocity based on past assignees performance
            let currentSprintFilter = rootState.projectView.query;

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
