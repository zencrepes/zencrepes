import _ from 'lodash';

import { cfgMilestones, cfgIssues } from "../../../data/Minimongo.js";

import {
    getAssigneesRepartition,
    getAssignees,
    getRepositories,
    getRepositoriesRepartition
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

export default {
    state: {
        sprints: [],
        selectedSprintTitle: 'No Sprint Selected',

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

        issues: [],

        milestones: [],

        velocity: [],

        openCreateSprint: false,
        createSprintName: '',
        createSprintEndDate: '',
        searchIssue: '',
        selectedIssue: null,
    },
    reducers: {
        setSprints(state, payload) {return { ...state, sprints: payload };},
        setSelectedSprintTitle(state, payload) {return { ...state, selectedSprintTitle: payload };},

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

        setIssues(state, payload) {return { ...state, issues: JSON.parse(JSON.stringify(payload)) };},
        setMilestones(state, payload) {return { ...state, milestones: JSON.parse(JSON.stringify(payload)) };},

        setVelocity(state, payload) {return { ...state, velocity: payload };},

        setOpenCreateSprint(state, payload) {return { ...state, openCreateSprint: payload };},
        setCreateSprintName(state, payload) {return { ...state, createSprintName: payload };},
        setCreateSprintEndDate(state, payload) {return { ...state, createSprintEndDate: payload };},
        setSearchIssue(state, payload) {return { ...state, searchIssue: payload };},
        setSelectedIssue(state, payload) {return { ...state, selectedIssue: payload };},

    },
    effects: {
        async updateAvailableSprints(payload, rootState) {
            let sprints = Object.keys(_.groupBy(cfgMilestones.find({'state':{'$in':['OPEN']}}).fetch(), 'title')).sort();
            this.setSprints(sprints);
        },
        async updateSelectedSprint(selectedSprintTitle, rootState) {
            await this.setSelectedSprintTitle(selectedSprintTitle);
            this.updateView();
        },

        async updateView(payload, rootState) {
            /*
            console.log('Update Sprint');
            console.log(selectedSprintTitle);
            console.log(rootState.sprintsView.selectedSprintTitle);
            if (selectedSprintTitle === null) {
                selectedSprintTitle = rootState.sprintPlanning.selectedSprintTitle;
            }
            this.setSelectedSprintTitle(selectedSprintTitle);
*/
            let selectedSprintTitle = rootState.sprintsView.selectedSprintTitle;
            let currentSprintFilter = {'milestone.title':{'$in':[selectedSprintTitle]}};

            // Create an array of assignees involved in a particular sprint
            let assignees = getAssigneesRepartition(cfgIssues.find(currentSprintFilter).fetch());
            this.setAssignees(assignees);

            let allAssignees = getAssignees(cfgIssues.find({}).fetch());
            let assigneesDifference = _.differenceBy(allAssignees, assignees, 'id');
            this.setAvailableAssignees(assigneesDifference);
            this.setFilteredAvailableAssignees(assigneesDifference);
            this.setAvailableAssigneesFilter('');

            let repositories = getRepositoriesRepartition(cfgIssues.find(currentSprintFilter).fetch());
            this.setRepositories(repositories);

            let allRepositories = getRepositories(cfgIssues.find({}).fetch());
            let repositoriesDifference = _.differenceBy(allRepositories, repositories, 'id');
            this.setAvailableRepositories(repositoriesDifference);
            this.setFilteredAvailableRepositories(repositoriesDifference);
            this.setAvailableRepositoriesFilter('');


            this.setIssues(cfgIssues.find({'milestone.title':{'$in':[selectedSprintTitle]}}).fetch());

            this.setMilestones(cfgMilestones.find({'title':{'$in':[selectedSprintTitle]}}).fetch());

            this.updateVelocity(assignees);
        },

        async updateVelocity(assignees, rootState) {
            //Build velocity based on past assignees performance
            let currentSprintFilter = {'state': { $eq : 'OPEN' }, 'milestone.title':{'$in':[rootState.sprintsView.selectedSprintTitle]}};

            let assigneesLogin = assignees.map((assignee) => assignee.login);
            let closedIssuesFilter = {'state': { $eq : 'CLOSED' },'assignees.edges':{'$elemMatch':{'node.login':{'$in':assigneesLogin}}}};
            let closedIssues = cfgIssues.find(closedIssuesFilter).fetch()
            console.log(closedIssues);

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

        async updateAvailableAssigneesFilter(payload, rootState) {
            this.setAvailableAssigneesFilter(payload);
            let filteredSet = _.filter(rootState.sprintsView.availableAssignees, function(assignee) {
                if (assignee.name !== null) {
                    if (assignee.name.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                }
                else if (assignee.login.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                else {return false;}
            });
            this.setFilteredAvailableAssignees(filteredSet);
        },

        async addAssignee(payload, rootState) {
            let currentAssignees = rootState.sprintsView.assignees;
            currentAssignees.push(payload);
            this.setAssignees(currentAssignees);
            console.log(currentAssignees);

            let allAssignees = getAssignees(cfgIssues.find({}).fetch());
            let assigneesDifference = _.differenceBy(allAssignees, currentAssignees, 'id');
            this.setAvailableAssignees(assigneesDifference);

            this.updateAvailableAssigneesFilter(rootState.sprintsView.availableAssigneesFilter);

            this.updateVelocity(currentAssignees);
        },

        async updateAvailableRepositoriesFilter(payload, rootState) {
            this.setAvailableRepositoriesFilter(payload);
            let filteredSet = _.filter(rootState.sprintsView.availableRepositories, function(repository) {
                if (repository.name.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                else if (repository.org.login.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                else {return false;}
            });
            this.setFilteredAvailableRepositories(filteredSet);
        },

        async addRepository(payload, rootState) {
            let currentRepositories = rootState.sprintsView.repositories;
            currentRepositories.push(payload);
            this.setRepositories(currentRepositories);
            console.log(currentRepositories);

            let allRepositories = getRepositories(cfgIssues.find({}).fetch());
            let repositoriesDifference = _.differenceBy(allRepositories, currentRepositories, 'id');
            this.setAvailableRepositories(repositoriesDifference);

            this.updateAvailableRepositoriesFilter(rootState.sprintsView.availableRepositoriesFilter);

            this.updateVelocity(currentRepositories);
        },

        async sprintCreated(payload, rootState) {
            console.log('sprintCreated');
            console.log(payload);
            console.log(rootState);
        }
    }
};
