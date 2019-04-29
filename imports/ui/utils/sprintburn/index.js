import {
    formatDate,
    populateOpen,
} from '../shared.js';

/*
*
* refreshBurndown() Takes a mongo selector (finder) and Initialize an object containing indices for all days between two dates
*
* Arguments:
* - mongoSelector: MongoDb query selector
* - cfgIssues: Minimongo instance
*/
export const refreshBurndown = (mongoSelector, cfgIssues, milestone) => {
    if (mongoSelector['state'] !== undefined) {
        delete mongoSelector['state'];
    }
    let closedIssuesFilter = {...mongoSelector, ...{'state':{$in:['CLOSED']}}};
    let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};

    let firstDay = getFirstDay(closedIssuesFilter, cfgIssues);
    let lastDay = getLastDay(mongoSelector, cfgIssues, milestone);

    let dataObject = initObject(firstDay, lastDay);                                         // Build an object of all days and weeks between two dates
    dataObject = populateTotals(dataObject, cfgIssues.find(closedIssuesFilter).fetch(), cfgIssues.find(openedIssuesFilter).fetch());      // Populate total numbers
    dataObject = populateClosed(dataObject, cfgIssues.find(closedIssuesFilter).fetch());    // Populate the object with count of days and weeks
    dataObject = populateOpen(dataObject, cfgIssues.find(openedIssuesFilter).fetch());      // Populate remaining issues count and remaining points
    dataObject = populateBurndown(dataObject);                                              // Populate remaining issues count and remaining points
    dataObject = populateVelocity(dataObject);
    return dataObject;
};

/*
*
* getFirstDay() Return the first day from a minimongo dataset
*
* Arguments:
* - mongoFilter: Filter to be applied to minimongo
* - cfgIssues: Minimongo instance
*/
const getFirstDay = (mongoFilter, cfgIssues) => {
    if (cfgIssues.find(mongoFilter).count() > 0) {
        let firstDay = formatDate(cfgIssues.findOne(mongoFilter, { sort: { closedAt: 1 }, reactive: false, transform: null }).closedAt);
        firstDay.setDate(firstDay.getDate() - 2);
        return firstDay
    } else {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        //return new Date();
        return date;
    }
};

/*
*
* getLastDay() Return a burndown's last day
*
* Arguments:
* - mongoFilter: Filter to be applied to minimongo
* - cfgIssues: Minimongo instance
* - milestone: The Current milestone
*/
export const getLastDay = (mongoFilter, cfgIssues, milestone) => {
    /*
        - If Milestone is closed, last day is the day of the last closed issue
        - If Milestone is open, last day is today is end of the sprint
     */
    let lastDay = new Date();
    if (milestone !== null && milestone.dueOn !== null) {
        lastDay = formatDate(milestone.dueOn);
    }

    let lastClosedIssue = lastDay;
    const lastIssue = cfgIssues.findOne(mongoFilter, {
        sort: {closedAt: -1},
        reactive: false,
        transform: null
    });
    let lastIssueClosedAt = null;
    if (lastIssue !== undefined) {
        lastIssueClosedAt = lastIssue.closedAt
    }
    /*
    const lastIssueClosedAt = cfgIssues.findOne(mongoFilter, {
        sort: {closedAt: -1},
        reactive: false,
        transform: null
    }).closedAt;
    */
    if (lastIssueClosedAt !== null) {
        lastClosedIssue = formatDate(lastIssueClosedAt);
    }
    if (milestone === null || lastClosedIssue > lastDay) {
        lastDay = lastClosedIssue
    }
    return lastDay;
};

/*
*
* initObject() Initialize an object containing indices for all days between two dates
*
* Arguments:
* - firstDay: first day in the object
* - lastDay: last day in the object
*/
const initObject = (firstDay, lastDay) => {
    let initObject = {days: {}};
    let currentDate = firstDay;
    while(currentDate < lastDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        initObject['days'][currentDate.toJSON().slice(0, 10)] = {
            date: currentDate.toJSON(),
            completion: {
                list: [],
                issues: {closed: 0, remaining: 0, velocity: 0},
                points: {closed: 0, remaining: 0, velocity: 0},
            },
            scopeChangeCompletion: {
                list: [],
                issues: {closed: 0, remaining: 0, velocity: 0},
                points: {closed: 0, remaining: 0, velocity: 0},
            }
        };
    }
    initObject['total'] = {
        issues: {closed: 0, opened: 0, total: 0},
        points: {closed: 0, opened: 0, total: 0}
    };
    return initObject;
};

/*
*
* populateTotals() Populate total number of points for open and closed issues
*
* Arguments:
* - dataObject: object to be modified
* - closedIssues: array of closed issues
* - openedIssues: array of opened issues
*/
const populateTotals = (dataObject, closedIssues, openedIssues) => {
    dataObject['total']['issues']['closed'] = closedIssues.length;
    dataObject['total']['points']['closed'] = closedIssues.map(issue => issue.points).reduce((acc, count) => acc + count, 0);

    dataObject['total']['issues']['opened'] = openedIssues.length;
    dataObject['total']['points']['opened'] = openedIssues.map(issue => issue.points).reduce((acc, count) => acc + count, 0);

    dataObject['total']['issues']['total'] = dataObject['total']['issues']['closed'] + dataObject['total']['issues']['opened'];
    dataObject['total']['points']['total'] = dataObject['total']['points']['closed'] + dataObject['total']['points']['opened'];

    return dataObject;
};

const stringClean = (labelName) => {
    return String(labelName).replace(/[^a-z0-9+]+/gi, '').toLowerCase();
};

/*
*
* populateArrays() Initialize an object containing indices for all days between two dates
*
* Arguments:
* - dataObject: Object to modify
* - issues: Collection of issues
*/
const populateClosed = (dataObject, issues) => {
    issues.forEach((issue) => {
        if (dataObject['days'][issue.closedAt.slice(0, 10)] !== undefined) {
            dataObject['days'][issue.closedAt.slice(0, 10)]['completion']['issues']['closed']++;
            if (issue.points !== null) {
                dataObject['days'][issue.closedAt.slice(0, 10)]['completion']['points']['closed'] += issue.points;
            }
            dataObject['days'][issue.closedAt.slice(0, 10)]['completion']['list'].push(issue);

            //Calculating if scope changed for this issue
            if (issue.labels.edges.filter(label => stringClean(label.node.name) === stringClean('Scope Change')).length !== 0) {
                dataObject['days'][issue.closedAt.slice(0, 10)]['scopeChangeCompletion']['issues']['closed']++;
                dataObject['days'][issue.closedAt.slice(0, 10)]['scopeChangeCompletion']['list'].push(issue);
                if (issue.points !== null) {
                    dataObject['days'][issue.closedAt.slice(0, 10)]['scopeChangeCompletion']['points']['closed'] += issue.points;
                }
            }

        }
    });
    return dataObject;
};


/*
*
* populateBurndown() Populate data points for the burndown chart
*
* Arguments:
* - dataObject: Object to modify
*/
const populateBurndown = (dataObject) => {
    let totalRemainingCount = dataObject.total.issues.total;
    let totalRemainingPoints = dataObject.total.points.total;
    for (let [key, day] of Object.entries(dataObject.days)){
        totalRemainingCount = totalRemainingCount - day['completion']['issues']['closed'];
        totalRemainingPoints = totalRemainingPoints - day['completion']['points']['closed'];
        dataObject.days[key]['completion']['issues']['remaining'] = totalRemainingCount;
        dataObject.days[key]['completion']['points']['remaining'] = totalRemainingPoints;
    }
    return dataObject;
};

/*
*
* populateVelocity() Populate data points for the velocity chart
*
* Arguments:
* - dataObject: Object to modify
*/
const populateVelocity = (dataObject) => {
    let ticketsPerDay = Object.values(dataObject['days']);
    let startIdx = 0;
    ticketsPerDay.map(function(value, idx) {
        if (idx <=20) {startIdx = 0;}
        else {startIdx = idx - 20;}
        if (idx !== 0) {
            let currentWindowIssues = ticketsPerDay.slice(startIdx, idx); // This limits the window or velocity calculation to 20 days (4 weeks).
            ticketsPerDay[idx]['completion']['issues']['velocity'] = calculateAverageVelocity(currentWindowIssues, 'issues');
            ticketsPerDay[idx]['completion']['points']['velocity'] = calculateAverageVelocity(currentWindowIssues, 'points');
        }
    });
    dataObject['days'] = ticketsPerDay;
    return dataObject;
};

/*
*
* calculateAverageVelocity() Calculate average velocity for some array elements
*
* Arguments:
* - array: input array
* - indexValue: index value to be used for the calculation
*/
const calculateAverageVelocity = (array, indexValue) => {
    return array
        .map(values => values['completion'][indexValue]['closed'])
        .reduce((accumulator, currentValue, currentIndex, array) => {
            accumulator += currentValue;
            if (currentIndex === array.length-1) {
                return accumulator/array.length;
            } else {
                return accumulator
            }
        });
};