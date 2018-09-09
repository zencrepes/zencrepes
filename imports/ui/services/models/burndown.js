import { cfgIssues } from '../../data/Minimongo.js';

import {getLastDay, populateOpen, populateTicketsPerDay, populateTicketsPerWeek } from '../../utils/velocity/index.js';
import {buildMongoSelector} from "../../utils/mongo/index.js";
import {formatDate} from "../../utils/velocity";

/*
*
* getFirstDay() Return the first day from a minimongo dataset
*
* Arguments:
* - mongoFilter: Filter to be applied to minimongo
* - cfgIssues: Minimongo instance
*/
export const getFirstDay = (mongoFilter, cfgIssues) => {
    if (cfgIssues.find(mongoFilter).count() > 0) {
        let firstDay = formatDate(cfgIssues.findOne(mongoFilter, { sort: { closedAt: 1 }, reactive: false, transform: null }).closedAt);
        firstDay.setDate(firstDay.getDate() - 2);
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
        initObject['days'][currentDate.toJSON().slice(0, 10)] = {
            date: currentDate.toJSON(),
            issues: [],
            count: {closed: 0, remaining: 0, velocity: 0},
            points: {closed: 0, remaining: 0, velocity: 0},
        };
    }
    initObject['total'] = {
        count: {closed: 0, opened: 0, total: 0},
        points: {closed: 0, opened: 0, total: 0}
    }
    return initObject;
};

/*
*
* populateArrays() Initialize an object containing indices for all days between two dates
*
* Arguments:
* - dataObject: Object to modify
* - issues: Collection of issues
*/
export const populateClosed = (dataObject, issues) => {
    issues.forEach((issue) => {
        if (dataObject['days'][issue.closedAt.slice(0, 10)] !== undefined) {
            dataObject['days'][issue.closedAt.slice(0, 10)]['count']['closed']++;
            if (issue.points !== null) {
                dataObject['days'][issue.closedAt.slice(0, 10)]['points']['closed'] += issue.points;
            }
            dataObject['days'][issue.closedAt.slice(0, 10)]['issues'].push(issue);
        }
    });
    return dataObject;
};

export const populateTotals = (dataObject, closedIssues, openedIssues) => {
    dataObject['total']['count']['closed'] = closedIssues.length;
    dataObject['total']['points']['closed'] = closedIssues.map(issue => issue.points).reduce((acc, count) => acc + count, 0);

    dataObject['total']['count']['opened'] = openedIssues.length;
    dataObject['total']['points']['opened'] = openedIssues.map(issue => issue.points).reduce((acc, count) => acc + count, 0);

    dataObject['total']['count']['total'] = dataObject['total']['count']['closed'] + dataObject['total']['count']['opened'];
    dataObject['total']['points']['total'] = dataObject['total']['points']['closed'] + dataObject['total']['points']['opened'];

    return dataObject;
};

export const populateBurndown = (dataObject) => {
    console.log(dataObject);
    let totalRemainingCount = dataObject.total.count.total;
    let totalRemainingPoints = dataObject.total.points.total;
    for (let [key, day] of Object.entries(dataObject.days)){
        totalRemainingCount = totalRemainingCount - day['count']['closed'];
        totalRemainingPoints = totalRemainingPoints - day['points']['closed'];
        dataObject.days[key]['count']['remaining'] = totalRemainingCount;
        dataObject.days[key]['points']['remaining'] = totalRemainingPoints;
    };
    return dataObject;
};

const calculateAverageVelocity = (array, indexValue) => {
    return array
        .map(values => values[indexValue]['closed'])
        .reduce((accumulator, currentValue, currentIndex, array) => {
            accumulator += currentValue;
            if (currentIndex === array.length-1) {
                return accumulator/array.length;
            } else {
                return accumulator
            }
        });
};


export const populateVelocity = (dataObject) => {
    let ticketsPerDay = Object.values(dataObject['days']);
    let startIdx = 0;
    ticketsPerDay.map(function(value, idx) {
        if (idx <=20) {startIdx = 0;}
        else {startIdx = idx - 20;}
        if (idx !== 0) {
            let currentWindowIssues = ticketsPerDay.slice(startIdx, idx); // This limits the window or velocity calculation to 20 days (4 weeks).
            ticketsPerDay[idx]['count']['velocity'] = calculateAverageVelocity(currentWindowIssues, 'count');
            ticketsPerDay[idx]['points']['velocity'] = calculateAverageVelocity(currentWindowIssues, 'points');
        }
    });
    dataObject['days'] = ticketsPerDay;
    return dataObject;
};


//Using the last known velocity, extrapolate how many more days will be necessary to complete
export const expandDays = (dataObject) => {

    return dataObject;
};

export default {
    state: {
        loadFlag: false,    // Flag to indicate the data should be reloaded
        loading: false,     // Data is currently loading
        initFlag: false, // Flag to check if the state was initialized at least once
        burndown: {},
        filters: {},
        defaultPoints: true,
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setInitFlag(state, payload) {return { ...state, initFlag: payload };},
        setBurndown(state, payload) {return { ...state, burndown: payload };},
        setFilters(state, payload) {return { ...state, filters: payload };},
        setDefaultPoints(state, payload) {return { ...state, defaultPoints: payload };},
    },
    effects: {
        async initStates(payload, rootState) {
            console.log('Init state - Burndown');
            let mongoSelector = buildMongoSelector(payload);
            this.setLoading(true);

            if (mongoSelector['state'] !== undefined) {
                delete mongoSelector['state'];
            }
            let closedIssuesFilter = {...mongoSelector, ...{'state':{$in:['CLOSED']}}};
            let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};

            let firstDay = getFirstDay(mongoSelector, cfgIssues);
            let lastDay = getLastDay(mongoSelector, cfgIssues);

            console.log(firstDay);
            console.log(lastDay);

            let dataObject = initObject(firstDay, lastDay);                                         // Build an object of all days and weeks between two dates
            dataObject = populateTotals(dataObject, cfgIssues.find(closedIssuesFilter).fetch(), cfgIssues.find(openedIssuesFilter).fetch());      // Populate total numbers
            dataObject = populateClosed(dataObject, cfgIssues.find(closedIssuesFilter).fetch());    // Populate the object with count of days and weeks
            dataObject = populateOpen(dataObject, cfgIssues.find(openedIssuesFilter).fetch());      // Populate remaining issues count and remaining points
            dataObject = populateBurndown(dataObject);                                              // Populate remaining issues count and remaining points
            console.log(dataObject);
            dataObject = populateVelocity(dataObject);
            console.log(dataObject);

            //dataObject = populateClosed(dataObject, cfgIssues.find(closedIssuesFilterNoSprint).fetch()); // Populate closed issues count and points
            //dataObject = populateTicketsPerDay(dataObject);
            //dataObject = populateTicketsPerWeek(dataObject);

            this.setBurndown(dataObject);
            this.setLoading(false);
            this.setInitFlag(true);
        }
    }
};