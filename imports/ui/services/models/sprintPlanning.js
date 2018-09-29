import _ from 'lodash';

import { getAssigneesRepartition, getAssignees, getRepositoriesRepartition, getRepositories } from '../../utils/repartition/index.js';
import {cfgIssues} from "../../data/Minimongo";
import {
    getFirstDay,
    getLastDay, initObject, populateClosed, populateObject, populateOpen,
    populateTicketsPerDay, populateTicketsPerWeek
} from "../../utils/velocity";

export default {
    state: {
        sprintName: 'No Sprint Selected',

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

        velocity: [],

        openCreateSprint: false,
        searchIssue: '',
        selectedIssue: '',

    },
    reducers: {
        setSprintName(state, payload) {return { ...state, sprintName: payload };},

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

        setVelocity(state, payload) {return { ...state, velocity: payload };},

        setOpenCreateSprint(state, payload) {return { ...state, openCreateSprint: payload };},
        setSearchIssue(state, payload) {return { ...state, searchIssue: payload };},
        setSelectedIssue(state, payload) {return { ...state, selectedIssue: payload };},
    },

    effects: {
        async updateSprint(sprintName, rootState) {
            console.log('Update Sprint');
            this.setSprintName(sprintName);

            let currentSprintFilter = {'milestone.title':{'$in':[sprintName]}};

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

            this.setIssues(cfgIssues.find({'milestone.title':{'$in':[sprintName]}}).fetch());

            this.updateVelocity(assignees);
        },

        async updateVelocity(assignees, rootState) {
            //Build velocity based on past assignees performance
            let currentSprintFilter = {'state': { $eq : 'OPEN' }, 'milestone.title':{'$in':[rootState.sprintPlanning.sprintName]}};

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
            let filteredSet = _.filter(rootState.sprintPlanning.availableAssignees, function(assignee) {
                if (assignee.name !== null) {
                    if (assignee.name.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                }
                else if (assignee.login.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                else {return false;}
            });
            this.setFilteredAvailableAssignees(filteredSet);
        },

        async addAssignee(payload, rootState) {
            let currentAssignees = rootState.sprintPlanning.assignees;
            currentAssignees.push(payload);
            this.setAssignees(currentAssignees);
            console.log(currentAssignees);

            let allAssignees = getAssignees(cfgIssues.find({}).fetch());
            let assigneesDifference = _.differenceBy(allAssignees, currentAssignees, 'id');
            this.setAvailableAssignees(assigneesDifference);

            this.updateAvailableAssigneesFilter(rootState.sprintPlanning.availableAssigneesFilter);

            this.updateVelocity(currentAssignees);
        },

        async updateAvailableRepositoriesFilter(payload, rootState) {
            this.setAvailableRepositoriesFilter(payload);
            let filteredSet = _.filter(rootState.sprintPlanning.availableRepositories, function(repository) {
                if (repository.name.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                else if (repository.org.login.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                else {return false;}
            });
            this.setFilteredAvailableRepositories(filteredSet);
        },

        async addRepository(payload, rootState) {
            let currentRepositories = rootState.sprintPlanning.repositories;
            currentRepositories.push(payload);
            this.setRepositories(currentRepositories);
            console.log(currentRepositories);

            let allRepositories = getRepositories(cfgIssues.find({}).fetch());
            let repositoriesDifference = _.differenceBy(allRepositories, currentRepositories, 'id');
            this.setAvailableRepositories(repositoriesDifference);

            this.updateAvailableRepositoriesFilter(rootState.sprintPlanning.availableRepositoriesFilter);

            this.updateVelocity(currentRepositories);
        },

    }
};

