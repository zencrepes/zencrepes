import _ from 'lodash';

import { getAssigneesRepartition, getAssignees } from '../../utils/repartition/index.js';
import {cfgIssues} from "../../data/Minimongo";
import {getRepositoriesRepartition} from "../../utils/repartition";
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

        repositories: [],
        availableRepositories: [],

        velocity: [],

        openAddAssignee: false,
    },
    reducers: {
        setSprintName(state, payload) {return { ...state, sprintName: payload };},
        setAssignees(state, payload) {return { ...state, assignees: payload };},
        setRepositories(state, payload) {return { ...state, repositories: payload };},
        setVelocity(state, payload) {return { ...state, velocity: payload };},
        setOpenAddAssignee(state, payload) {return { ...state, openAddAssignee: payload };},
        setAvailableAssignees(state, payload) {return { ...state, availableAssignees: payload };},
        setFilteredAvailableAssignees(state, payload) {return { ...state, filteredAvailableAssignees: payload };},
        setAvailableAssigneesFilter(state, payload) {return { ...state, availableAssigneesFilter: payload };},
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

            //Build velocity based on past assignees performance
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
        },
    }
};

