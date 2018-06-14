import { cfgIssues } from '../../data/Issues.js';

import { getFirstDay, getLastDay, initObject, populateObject, populateTicketsPerDay, populateTicketsPerWeek } from '../../utils/velocity/index.js';
import {buildMongoSelector} from "../../utils/mongo/index.js";

const getAssignees = (issues) => {
    console.log('getAssignees');

    let statesGroup = [];

    let allValues = [];
    issues.forEach((issue) => {
        if (issue['assignees'].totalCount === 0) {
            let pushObj = {};
            pushObj['login'] = 'UNASSIGNED';
            allValues.push(pushObj);
        } else {
            issue['assignees'].edges.map((nestedValue) => {
                if (nestedValue.node['login'] === null || nestedValue.node['login'] === '' || nestedValue.node['login'] === undefined ) {
                    //console.log({...nestedValue.node, name: nestedValue.node.login});
                    allValues.push({...nestedValue.node, name: nestedValue.node.login});
                } else {
                    allValues.push(nestedValue.node);
                }
            })
        }
    });
    statesGroup = _.groupBy(allValues, 'login');


    // If the key is 'undefined', replace with default facet name
    if (statesGroup['undefined'] !== undefined) {
        statesGroup['UNASSIGNED'] = statesGroup['undefined'];
        delete statesGroup['undefined'];
    }

    let states = [];
    Object.keys(statesGroup).forEach(function(key) {
        states.push({count: statesGroup[key].length, login: key });
    });
    //Return the array sorted by count
    return states.sort((a, b) => b.count - a.count);
    //{header: 'Assignees', group: 'assignees', type: 'text', nested: 'login', nullName: 'UNASSIGNED', nullFilter: {'assignees.totalCount': { $eq : 0 }}, data: [] },

};

const openedIssues = (mongoFilter) => {
    let updatedFilter = Object.assign({}, mongoFilter);
    if (updatedFilter['state'] !== undefined) {delete updatedFilter['state'];}
    updatedFilter['state'] = 'OPEN';
    return updatedFilter;
};

export default {
    state: {
        loadFlag: false,
        loading: false,
        filter: {},
        repartition: [],
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setFilter(state, payload) {return { ...state, filter: payload };},
        setRepartition(state, payload) {return { ...state, repartition: payload };},

    },
    effects: {
        async initStates(payload, rootState) {
            //console.log('Repartition Filter: ' + JSON.stringify(rootState.repartition.filter));
            let mongoSelector = buildMongoSelector(rootState.repartition.filter);
            //console.log('Repartition Mongo Selector: ' + JSON.stringify(mongoSelector));

            //console.log(cfgIssues.find(rootState.repartition.mongoFilter).fetch());
            this.setLoading(true);

            //console.log('Start Loading');

            //Build an aggregate by assignee
            let assignees = getAssignees(cfgIssues.find(openedIssues(mongoSelector)).fetch());
            assignees = assignees.map((assignee) => {
                //console.log('Repartition - processing: ' + assignee.login);
                let closedIssuesFilter = {'state':{$in:['CLOSED']},'assignees.edges':{$elemMatch:{'node.login':{$in:[assignee.login]}}}};
                let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']},'assignees.edges':{$elemMatch:{'node.login':{$in:[assignee.login]}}}}};
                //console.log(closedIssuesFilter);
                //console.log(JSON.stringify(openedIssuesFilter));

                if (cfgIssues.find(closedIssuesFilter).count() > 0) {
                    let firstDay = getFirstDay(closedIssuesFilter, cfgIssues);
                    let lastDay = getLastDay(closedIssuesFilter, cfgIssues);

                    let dataObject = initObject(firstDay, lastDay); // Build an object of all days and weeks between two dates
                    dataObject = populateObject(dataObject, cfgIssues.find(closedIssuesFilter).fetch()); // Populate the object with count of days and weeks
                    dataObject = populateTicketsPerDay(dataObject);
                    dataObject = populateTicketsPerWeek(dataObject, cfgIssues.find(openedIssuesFilter).count());
                    //console.log(dataObject);

                    //1- Calculate velocity for this user. Velocity calculate over the entire dataset.
                    //
                    // {"assignees.edges":{"$elemMatch":{"node.login":{"$in":["rtisma"]}}}}
                    // {"state":{"$in":["OPEN"]},"assignees.edges":{"$elemMatch":{"node.login":{"$in":["rtisma"]}}}}
                    //return Object.assign({}, assignee, dataObject);
                    return {...assignee, ...dataObject}
                } else {
                    return assignee
                }
            });

            console.log(assignees);

            this.setRepartition(assignees);

            this.setLoading(false);
        }
    }
};