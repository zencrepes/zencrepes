import { cfgIssues } from '../../data/Minimongo.js';

import {getLastDay, populateObject, populateOpen, populateClosed, populateTicketsPerDay, populateTicketsPerWeek } from '../../utils/velocity/index.js';
import {buildMongoSelector} from "../../utils/mongo/index.js";
import {formatDate} from "../../utils/velocity";

/*
*
* getFirstDayCreated() Return the first day from a minimongo dataset
*
* Arguments:
* - mongoFilter: Filter to be applied to minimongo
* - cfgIssues: Minimongo instance
*/
export const getFirstDayCreated = (mongoFilter, cfgIssues) => {
    if (cfgIssues.find(mongoFilter).count() > 0) {
        let firstDay = formatDate(cfgIssues.findOne(mongoFilter, { sort: { createdAt: 1 }, reactive: false, transform: null }).closedAt);
        firstDay.setDate(firstDay.getDate() - 1);
        return firstDay
    } else {
        return new Date() - 1;
    }
};

/*
*
* initObject() Initialize an object containing indices for all days between two dates
*
* Arguments:
* - firstDay: first day in the object
* - lastDay: last day in the object
*/
export const initObject = (firstDay, lastDay) => {
    let initObject = {days: {}};
    let currentDate = firstDay;
    while(currentDate < lastDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            initObject['days'][currentDate.toJSON().slice(0, 10)] = {
                date: currentDate.toJSON(),
                issues: {closed: 0, remaining: 0},
                points: {closed: 0, remaining: 0},
            };
        }
    }
    return initObject;
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
            console.log('Init state - Burndown');
            let mongoSelector = buildMongoSelector(rootState.velocity.filters);
            this.setLoading(true);

            if (mongoSelector['state'] !== undefined) {
                delete mongoSelector['state'];
            }
            let closedIssuesFilter = {...mongoSelector, ...{'state':{$in:['CLOSED']}}};
            let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};

            let firstDay = getFirstDayCreated(mongoSelector, cfgIssues);
            let lastDay = getLastDay(mongoSelector, cfgIssues);

            console.log(firstDay);
            console.log(lastDay);

            let dataObject = initObject(firstDay, lastDay); // Build an object of all days and weeks between two dates
            console.log(dataObject);
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