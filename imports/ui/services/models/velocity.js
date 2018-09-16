import _ from 'lodash';

import { cfgIssues } from '../../data/Minimongo.js';

import { getFirstDay, getLastDay, initObject, populateObject, populateOpen, populateClosed, populateTicketsPerDay, populateTicketsPerWeek } from '../../utils/velocity/index.js';
import {buildMongoSelector} from "../../utils/mongo/index.js";

/**
 * getAssignees() Return an array of assignees
 *
 * Arguments:
 * - issues: Array of issues
 */
const getAssignees = (issues) => {
    //statesGroup = _.groupBy(issues, 'assignees.login');
    let allValues = [];
    issues.forEach((issue) => {
        //console.log(issue);
        if (issue['assignees'].totalCount > 0) {
            issue['assignees'].edges.forEach((assignee) => {
                //console.log(assignee);
                allValues.push(assignee.node.login);
            });
        }
    });
//    console.log(allValues);
    return _.uniq(allValues);
    //statesGroup = _.groupBy(allValues, facet.nested);
};

export default {
    state: {
        loadFlag: false,    // Flag to indicate the data should be reloaded
        loading: false,     // Data is currently loading
        initFlag: false, // Flag to check if the state was initialized at least once
        velocity: {},
        filters: {},
        defaultPoints: true,
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setInitFlag(state, payload) {return { ...state, initFlag: payload };},
        setVelocity(state, payload) {return { ...state, velocity: payload };},
        setFilters(state, payload) {return { ...state, filters: payload };},
        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},
    },
    effects: {
        async initStates(payload, rootState) {
            console.log('Init state');
            let mongoSelector = buildMongoSelector(rootState.velocity.filters);
            this.setLoading(true);

            if (mongoSelector['state'] !== undefined) {
                delete mongoSelector['state'];
            }
            let closedIssuesFilter = {...mongoSelector, ...{'state':{$in:['CLOSED']}}};
            let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};

            // It is impossible and sometime irrelevant to calculate velocity when filtered on a sprint as it involves
            // a strongly limited timeframe. In that case, we replace in the query the sprint by the list of assignees
            // in this sprint, then calculate their velocity.
            if (closedIssuesFilter['milestone.title'] !== undefined) {
                let assignees = getAssignees(cfgIssues.find(closedIssuesFilter).fetch());
                closedIssuesFilter = {...closedIssuesFilter, ...{'assignees.edges':{'$elemMatch':{'node.login':{'$in':assignees}}}}};
                delete closedIssuesFilter['milestone.title'];
            }

            let closedIssuesFilterNoSprint = JSON.parse(JSON.stringify(closedIssuesFilter));
            if (closedIssuesFilterNoSprint['milestone.state'] !== undefined) {
                delete closedIssuesFilterNoSprint['milestone.state'];
            }

            let firstDay = getFirstDay(closedIssuesFilter, cfgIssues);
            let lastDay = getLastDay(closedIssuesFilter, cfgIssues);

            let dataObject = initObject(firstDay, lastDay); // Build an object of all days and weeks between two dates
            dataObject = populateObject(dataObject, cfgIssues.find(closedIssuesFilterNoSprint).fetch()); // Populate the object with count of days and weeks
            dataObject = populateOpen(dataObject, cfgIssues.find(openedIssuesFilter).fetch()); // Populate remaining issues count and remaining points
            dataObject = populateClosed(dataObject, cfgIssues.find(closedIssuesFilterNoSprint).fetch()); // Populate closed issues count and points
            dataObject = populateTicketsPerDay(dataObject);
            dataObject = populateTicketsPerWeek(dataObject);

            console.log(closedIssuesFilter);
            console.log('+++++++++');
            console.log(dataObject);
            console.log('+++++++++');

            this.setVelocity(dataObject);
            this.setLoading(false);
            this.setInitFlag(true);
        }
    }
};