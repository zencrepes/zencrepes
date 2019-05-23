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
    getColumnsRepartition,
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

const labelsFromQuery = (query) => {
    const labels = [];
    cfgIssues.find(query).forEach((issue) => {
        if (issue.labels.totalCount > 0) {
            issue.labels.edges.forEach((edge) => {
                if (_.findIndex(labels, {'id': edge.node.id}) === -1) {
                    labels.push(edge.node);
                }
            })
        }
    });
    return labels;
};

export default {
    state: {
        query: {},
        projects: [],                       // Array of projects
        projectsIssues: [],                 // Array of projects issues, project issues are used to link the project to a milestone as well as to define team members
        sprints: [],
        showClosed: false,
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
            this.updateProject();

            this.updateSprints();
            this.updateView();

            this.updateFilterLabels();
        },

        async updateProject(payload, rootState) {
            //{"projectCards.edges":{"$elemMatch":{"node.project.name":{"$in":["Test%20Project%201"]}}}}
            const projectArray = _.get(rootState.projectView.query, ['projectCards.edges', '$elemMatch', 'node.project.name', '$in'], null);
            let identifiedProject = [];
            if (projectArray[0] !== undefined) {
                const projectName = projectArray[0];
                identifiedProject = cfgProjects.find({'name': projectName}).fetch();

                //Find activity cards
                const activityIssues = cfgIssues.find({"projectCards.edges":{"$elemMatch":{"node.project.name":{"$in":[projectName]}}},"labels.edges":{"$elemMatch":{"node.name":{"$in":[Meteor.settings.public.labels.activity_label]}}}}).fetch();
                this.setProjectsIssues(activityIssues);
            }
            if (rootState.projectView.projects[0] !== undefined && identifiedProject[0].name !== rootState.projectView.projects[0].name) {
                this.setSelectedSprintLabel('no-filter');
            }
            this.setProjects(identifiedProject);
        },

        async updateFilterLabels(payload, rootState) {
            const query = rootState.projectView.query;

            let labels = labelsFromQuery(query);
            if (Meteor.settings.public.labels.area_prefix !== undefined) {
                let areaLabelFilter = RegExp(Meteor.settings.public.labels.area_prefix + '(.+)');
                labels = labels.filter(label => areaLabelFilter.test(label.name));
            }
            this.setFilterLabelsAvailable(labels);

            //Need to build an array of labels without any filters, just the project
            const cleanfilter = {'projectCards.edges': {...query['projectCards.edges']}};
            const allLabels = labelsFromQuery(cleanfilter);

            let notFiltersCombo = [];
            if (rootState.projectView.query['$and'] !== undefined) {
                rootState.projectView.query['$and'].forEach((k) => {
                    if (k['labels.edges'] !== undefined && k['labels.edges']['$not'] !== undefined) {
                        notFiltersCombo = _.get(k, ['labels.edges', '$not', '$elemMatch', 'node.name', '$in'], []);
                    }
                })
            }
            //_.get(rootState.projectView.query, ['$and', 'labels.edges', '$not', '$elemMatch', 'node.name', '$in'], []);
            const notFiltersSolo = _.get(rootState.projectView.query, ['labels.edges', '$not', '$elemMatch', 'node.name', '$in'], []);
            const notFilters = [...notFiltersCombo, ...notFiltersSolo];
//            console.log(notFilters);
//            console.log(JSON.stringify(rootState.projectView.query));
//            console.log(rootState.projectView.query);
            const labelsSelected = allLabels.filter(label => notFilters.find(elem => elem === label.name) !== undefined);
            this.setFilterLabelsSelected(labelsSelected)
        },

        //Browse through all of the project's issues to fetch sprints values
        async updateSprints(payload, rootState) {
            //Go through all of the projects issues to find out if there are sprints.
            let sprintsValues = {};
            let projectQuery = {...rootState.projectView.query};


            // Fetch sprint label (if any)
            //"labels.edges":{"$elemMatch":{"node.name":{"$in":["phase:ga"]}}}}
            const LabelFilter = _.get(rootState.projectView.query, ['labels.edges', '$elemMatch', 'node.name', '$in'], []);
            let andInLabelFilter = [];
            if (rootState.projectView.query['$and'] !== undefined) {
                rootState.projectView.query['$and'].forEach((k) => {
                    if (k['labels.edges'] !== undefined && k['labels.edges']['$elemMatch'] !== undefined) {
                        andInLabelFilter = _.get(k, ['labels.edges', '$elemMatch', 'node.name', '$in'], []);
                    }
                })
            }
            const labelArray = [...LabelFilter, ...andInLabelFilter];

            if (labelArray.length > 0) {
                this.setSelectedSprintLabel(labelArray[0]);
            } else {
                this.setSelectedSprintLabel('no-filter');
            }

            if (projectQuery['labels.edges'] !== undefined) {
                delete projectQuery['labels.edges'];
            }

            cfgIssues.find(projectQuery).forEach((issue) => {
                issue.labels.edges.map((label) => {
                    if (Meteor.settings.public.labels.sprint_prefix !== undefined) {
                        let sprintLabelFilter = RegExp(Meteor.settings.public.labels.sprint_prefix + '(.+)');
                        if (sprintLabelFilter.test(label.node.name)) {
                            if (sprintsValues[label.node.name] === undefined) {
                                sprintsValues[label.node.name] = {name: label.node.name, issues: 1, increment: label.node.name.replace(Meteor.settings.public.labels.sprint_prefix, '')};
                            } else {
                                sprintsValues[label.node.name]['issues'] = sprintsValues[label.node.name]['issues'] + 1;
                            }
                        }
                    }
                    if (Meteor.settings.public.labels.phase_prefix !== undefined) {
                        let sprintPhaseFilter = RegExp(Meteor.settings.public.labels.phase_prefix + '(.+)');
                        if (sprintPhaseFilter.test(label.node.name)) {
                            if (sprintsValues[label.node.name] === undefined) {
                                sprintsValues[label.node.name] = {name: label.node.name, issues: 1, increment: label.node.name.replace(Meteor.settings.public.labels.phase_prefix, '')};
                            } else {
                                sprintsValues[label.node.name]['issues'] = sprintsValues[label.node.name]['issues'] + 1;
                            }
                        }
                    }
                });
            });
            sprintsValues = Object.values(sprintsValues);
            sprintsValues = sprintsValues.map((label) => {
                return {...label, display: label.name + ' (' + label.issues + ' issues)'}
            });
            // If one of the sprint label has a numerical value but gaps, the system will try to fill those.
            if (Meteor.settings.public.labels.sprint_prefix !== undefined) {
                let sprintLabelFilter = RegExp(Meteor.settings.public.labels.sprint_prefix + '(.+)');
                const sprintsNumIncrement = sprintsValues.filter(label => sprintLabelFilter.test(label.name)).filter(label => Number.isInteger(parseInt(label.increment))).map(label => parseInt(label.increment));
                if (sprintsNumIncrement.length > 0) {
                    const highestSprint = Math.max(...sprintsNumIncrement);
                    for (var i = 0; i < highestSprint + 2; i++) {
                        if (_.findIndex(sprintsValues.filter(label => sprintLabelFilter.test(label.name)), (label) => {
                            return label.increment === String(i);
                        }) === -1) {
                            let labelName = Meteor.settings.public.labels.sprint_prefix + i;
                            sprintsValues.push({
                                name: labelName,
                                issues: 0,
                                increment: i,
                                display: labelName + ' (0 issues)'
                            })
                        }
                    }
                }
            }

            if (Meteor.settings.public.labels.phase_prefix !== undefined) {
                let sprintPhaseFilter = RegExp(Meteor.settings.public.labels.phase_prefix + '(.+)');
                const sprintsNumIncrement = sprintsValues.filter(label => sprintPhaseFilter.test(label.name)).filter(label => Number.isInteger(parseInt(label.increment))).map(label => parseInt(label.increment));
                if (sprintsNumIncrement.length > 0) {
                    const highestSprint = Math.max(...sprintsNumIncrement);
                    for (var j = 0; j < highestSprint + 2; j++) {
                        if (_.findIndex(sprintsValues.filter(label => sprintPhaseFilter.test(label.name)), (label) => {
                            return label.increment === String(j);
                        }) === -1) {
                            let labelName = Meteor.settings.public.labels.phase_prefix + j;
                            sprintsValues.push({
                                name: labelName,
                                issues: 0,
                                increment: j,
                                display: labelName + ' (0 issues)'
                            })
                        }
                    }
                }
            }

            sprintsValues = _.sortBy(sprintsValues, ['name']);
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

            // If no issues have points, move to default by count.
            const issuesPoints = issues.filter(issue => issue.points !== null).length;
            if (issuesPoints === 0 && issues.length > 0) {
                this.setDefaultPoints(false);
            } else {
                this.setDefaultPoints(true);
            }

            // Create an array of assignees involved in a particular sprint
            const primaryAssignees = rootState.projectView.projectsIssues.reduce((tally, issue) => {
                if (issue.assignees.totalCount > 0) {
                    issue.assignees.edges.forEach((assignee) => {
                        tally[assignee.node.login] = assignee.node;
                    })
                }
                return tally;
            }, {});

            let assignees = getAssigneesRepartition(cfgIssues.find(rootState.projectView.query).fetch());

            //Decorate with flag for members part of the core project team.
            assignees = assignees.map((assignee) => {
                return {
                    ...assignee,
                    core: (primaryAssignees[assignee.login] !== undefined ? true : false)
                }
            });
            this.setAssignees(assignees);

            let openQuery = {...rootState.projectView.query, 'state': { $eq : 'OPEN' }};
            let assigneesRemaining = getAssigneesRepartition(cfgIssues.find(openQuery).fetch());
            this.setAssigneesRemaining(assigneesRemaining);

            if (rootState.projectView.velocityTeam === true) {
                assignees = assignees.filter(assignee => assignee.core === true);
            }
            this.updateVelocity(assignees);

            this.updateBurndown(rootState.projectView.query);

            let labels = getLabelsRepartition(cfgIssues.find(rootState.projectView.query).fetch());
            this.setLabels(labels);

            let milestones = getMilestonesRepartition(cfgIssues.find(rootState.projectView.query).fetch());
            this.setMilestones(milestones);

            let columns = getColumnsRepartition(cfgIssues.find(rootState.projectView.query).fetch(), rootState.projectView.projects[0].name);
            this.setColumns(columns);

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

            let assignees = rootState.projectView.assignees;
            if (payload === true) {
                assignees = assignees.filter(assignee => assignee.core === true);
            }
            this.updateVelocity(assignees);
        },

        async updateVelocity(assignees, rootState) {
            //Build velocity based on past assignees performance
            let currentSprintFilter = {...rootState.projectView.query, 'state': { $eq : 'OPEN' }};

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
