import _ from 'lodash';
import { Meteor } from 'meteor/meteor';

import { cfgMilestones, cfgIssues, cfgSources, cfgLabels } from "../../../data/Minimongo.js";

import {
//    getAssigneesRepartition,
    getAssignees,
    getRepositories,
//    getRepositoriesRepartition,
//    getLabelsRepartition,
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

import {
    sortIssues,
} from "../../../utils/agileboard/index.js";


export default {
    state: {
        query: {},
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
        setQuery(state, payload) {return { ...state, query: payload };},

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

            this.updateSprints();
            this.updateView();

            /*
            // Generate available sprints based on query, removing milestone title
            let sprintsQuery = JSON.parse(JSON.stringify(query)); //TODO - Replace this with something better to copy object ?
            if (sprintsQuery['title'] !== undefined) {
                delete sprintsQuery['title'];
            }

            let milestonesQuery = {'state':{'$in':['OPEN']}};
            if (rootState.sprintsView.showClosed) {
                milestonesQuery = {};
            }

            const sprints = Object.keys(_.groupBy(cfgMilestones.find(milestonesQuery).fetch(), 'title')).sort();
            this.setSprints(sprints);

            // If there was no sprint selected, if the query is blank, automatically select the first sprint in the array of sprints
            if (rootState.sprintsView.selectedSprintLabel === null && sprints[0] !== undefined && _.isEmpty(query, true)) {
                this.setSelectedSprintTitle(sprints[0]);
            }

            if (query.title !== undefined) {
                const currentMilestone = cfgMilestones.findOne(query);
                if (currentMilestone.title !== undefined) {
                    this.setSelectedSprintTitle(currentMilestone.title);
                    this.updateView();
                }
            }
            */
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

            /*
            let selectedSprintLabel = rootState.sprintsView.selectedSprintLabel;
            let currentSprintFilter = {'milestone.title':{'$in':[selectedSprintLabel]}};

            // Check if the query doesn't return any issues with points, set default back to issues count.
            const pointsQuery = {...currentSprintFilter, points: {$gt: 0}};
            if (cfgIssues.find(pointsQuery).count() === 0) {this.setDefaultPoints(false);} else {this.setDefaultPoints(true);}

            // Create an array of assignees involved in a particular sprint
            let assignees = getAssigneesRepartition(cfgIssues.find(currentSprintFilter).fetch());
            this.setAssignees(assignees);

            let allAssignees = getAssignees(cfgIssues.find({}).fetch());
            let assigneesDifference = _.differenceBy(allAssignees, assignees, 'id');
            this.setAvailableAssignees(assigneesDifference);
            this.setFilteredAvailableAssignees(assigneesDifference);
            this.setAvailableAssigneesFilter('');

            const milestones = getRepositoriesRepartition(cfgMilestones.find({'title':{'$in':[selectedSprintLabel]}}).fetch(), cfgIssues.find(currentSprintFilter).fetch());
            this.setRepositories(milestones);
            this.setMilestones(milestones);

            let labels = getLabelsRepartition(cfgIssues.find(currentSprintFilter).fetch());
            this.setLabels(labels);

            let allRepositories = getRepositories(cfgIssues.find({}).fetch());
            let repositoriesDifference = _.differenceBy(allRepositories, milestones, 'id');
            this.setAvailableRepositories(repositoriesDifference);
            this.setFilteredAvailableRepositories(repositoriesDifference);
            this.setAvailableRepositoriesFilter('');

            if (selectedSprintLabel !== null) {
                const issues = cfgIssues.find({'milestone.title':{'$in':[selectedSprintLabel]}}).fetch();
                this.setIssues(issues);

                // Only update burndown if there are actually issues
                if (issues.length > 0) {
                    this.updateBurndown(currentSprintFilter, milestones[0]);
                } else {
                    this.setBurndown({});
                }
            }

            this.updateVelocity(assignees);

            this.updateDescriptionDate();

            this.updateAvailableRepos();

            this.updateAvailableSprints();

            this.updateSprintBoard();
            */
        },

        async updateSprintBoard(payload, rootState) {
            const log = rootState.global.log;
            let t0 = performance.now();

            //1- Identify the available columns by looking into the milestones
            // As a requirement and to make it easier to code, all repos must be consistent with their columns (all repos should have the same columns)
            const milestones = rootState.sprintsView.milestones;
//            console.log(milestones);
            // Build an array of repoIds
            const reposIds = milestones.map(mls => mls.repo.id);
//            console.log(reposIds);
            const reposLabels = cfgLabels.find({"repo.id":{"$in":reposIds}}).fetch();
//            console.log(reposLabels);
            //Filter labels to only keep those with agile board settings
            const boardExp = RegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
            const labelsBoard = reposLabels.filter(lbl => boardExp.test(lbl.description) === true);
//            console.log(labelsBoard);
            this.setAgileBoardLabels(labelsBoard);

            const grouppedLabels = _.groupBy(labelsBoard, 'name');
//            console.log(grouppedLabels);

            const issues = sortIssues(rootState.sprintsView.issues);

            let boardColumns = {};
            boardColumns['unassigned'] = {
                id: 'unassigned',
                title: 'Open',
                issueIds: issues.filter(issue => issue.state === 'OPEN' && issue.boardState === null).map(issue => issue.id),
            };
            let boardColumnsArray = [];
            for (let [columnLabelName, labels] of Object.entries(grouppedLabels)){
                const boardLabel = boardExp.exec(labels[0].description);
                boardColumnsArray.push({
                    id: columnLabelName,
                    priority: boardLabel.groups.priority,
                });
                boardColumns[columnLabelName] = {
                    id: columnLabelName,
                    title: boardLabel.groups.name,
                    priority: boardLabel.groups.priority,
                    labels: labels,
                    issueIds: issues.filter(issue => issue.boardState !== undefined && issue.boardState !== null && issue.state !== 'CLOSED').filter(issue => issue.boardState.label.name === columnLabelName).map(issue => issue.id),
                }
            }
            boardColumns['closed'] = {
                id: 'closed',
                title: 'Closed',
                issueIds: issues.filter(issue => issue.state === 'CLOSED').map(issue => issue.id),
            };
//            console.log(boardColumns);

            let columnOrder = _.sortBy(boardColumnsArray, ['priority']).map(col => col.id);
            columnOrder.unshift('unassigned');
            columnOrder.push('closed');
//            console.log(columnOrder);

            const allIssues = issues.reduce((obj, item) => {
                obj[item['id']] = item;
                return obj
            }, {});

            const boardData = {
                issues: allIssues,
                columns: boardColumns,
                columnOrder: columnOrder,
            };
//            console.log(boardData);
            this.setAgileBoardData(boardData);
//            console.log(JSON.stringify(boardData));

            var t1 = performance.now();
            log.info("updateSprintBoard - took " + (t1 - t0) + " milliseconds.");
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
            await this.setSelectedSprintTitle(selectedSprintLabel);
            this.updateView();
        },

        async updateBurndown(currentSprintFilter, rootState, milestone) {
            const burndown = refreshBurndown(currentSprintFilter, cfgIssues, milestone, rootState.sprintsView.velocity);
            this.setBurndown(burndown);
        },


        async addRepoUpdateSelected(selectedRepos) {
            this.setAddReposSelected(selectedRepos);
        },

        async updateAvailableRepos(payload, rootState) {
            const selectedSprintLabel = rootState.sprintsView.selectedSprintLabel;
            const milestones = cfgMilestones.find({'title':{'$in':[selectedSprintLabel]}}).fetch()
            const includedRepos = milestones.map((ms) => ms.repo);
            const allRepos = cfgSources.find({active: true}).fetch();
            const availableRepos = _.differenceBy(allRepos, includedRepos, 'id');
            this.setAddReposAvailable(availableRepos.map((repo) => {
                return {
                    value: repo.id,
                    label: repo.org.login + "/" + repo.name
                }
            }));
        },

        async updateVelocity(assignees, rootState) {
            //Build velocity based on past assignees performance
            let currentSprintFilter = {'state': { $eq : 'OPEN' }, 'milestone.title':{'$in':[rootState.sprintsView.selectedSprintLabel]}};

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

        async updateDescriptionDate(payload, rootState) {
            /*
            this.setSelectedSprintDescription('# Live demo\n' +
                '\n' +
                'Changes are automatically rendered as you type.\n' +
                '\n' +
                '* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)\n' +
                '* Renders actual, "native" React DOM elements\n' +
                '* Allows you to escape or skip HTML (try toggling the checkboxes above)\n' +
                '* If you escape or skip the HTML, no `dangerouslySetInnerHTML` is used! Yay!\n' +
                '\n');
                */
            if (rootState.sprintsView.milestones[0] !== undefined) {
                this.setSelectedSprintDescription(rootState.sprintsView.milestones[0].description);
            } else {
                this.setSelectedSprintDescription(null);
            }
            if (rootState.sprintsView.milestones[0] !== undefined) {
                this.setSelectedSprintDueDate(rootState.sprintsView.milestones[0].dueOn);
            } else {
                this.setSelectedSprintDueDate(null);
            }
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

            let allRepositories = getRepositories(cfgIssues.find({}).fetch());
            let repositoriesDifference = _.differenceBy(allRepositories, currentRepositories, 'id');
            this.setAvailableRepositories(repositoriesDifference);

            this.updateAvailableRepositoriesFilter(rootState.sprintsView.availableRepositoriesFilter);

            this.updateVelocity(currentRepositories);
        },

    }
};
