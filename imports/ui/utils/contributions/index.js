import _ from 'lodash';

/*
*
* refreshContributions() Takes an array of issues and build a matrix of individual contributions per day
*
* Arguments:
* - issues: Array of issues
*/
export const refreshContributions = (issues, firstIssue) => {
    //Build an array of days corresponding to the interval
    let firstDay = formatDate(firstIssue.closedAt);
    let lastDay = new Date();

    const datesObject = initObject(firstDay, lastDay);

    //Implemented by: project, milestone, area
    // Trying to build this using a reducer
    const dataObject = issues.reduce((tally, issue) => {
        if (issue.assignees.totalCount > 0) {
            issue.assignees.edges.forEach((assignee) => {
                if (tally[assignee.node.login] === undefined) {
                    tally[assignee.node.login] = {
                        login: assignee.node.login,
                        assignee: assignee.node,
                        projects: {empty: {project: null, dates: _.cloneDeep(datesObject)}},
                        milestones: {empty: {milestone: null, dates: _.cloneDeep(datesObject)}},
                        areas: {empty: {label: null, dates: _.cloneDeep(datesObject)}},
                        all: _.cloneDeep(datesObject),
                    }
                }
                // 1- Populate the all section
                if (tally[assignee.node.login]['all'][issue.closedAt.slice(0, 10)] !== undefined) {
                    tally[assignee.node.login]['all'][issue.closedAt.slice(0, 10)]['issues']++;
                    tally[assignee.node.login]['all'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                    if (issue.points !== null) {
                        tally[assignee.node.login]['all'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                    }
                }

                // 2- Populate by milestone
                if (issue.milestone === null) {
                    if (tally[assignee.node.login]['milestones']['empty'][issue.closedAt.slice(0, 10)] !== undefined) {
                        tally[assignee.node.login]['milestones']['empty'][issue.closedAt.slice(0, 10)]['issues']++;
                        tally[assignee.node.login]['milestones']['empty'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                        if (issue.points !== null) {
                            tally[assignee.node.login]['milestones']['empty'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                        }
                    }
                } else {
                    if (tally[assignee.node.login]['milestones'][issue.milestone.title] === undefined) {
                        tally[assignee.node.login]['milestones'][issue.milestone.title] = {
                            milestone: issue.milestone,
                            dates: _.cloneDeep(datesObject)
                        }
                    }
                    if (tally[assignee.node.login]['milestones'][issue.milestone.title]['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                        tally[assignee.node.login]['milestones'][issue.milestone.title]['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                        tally[assignee.node.login]['milestones'][issue.milestone.title]['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                        if (issue.points !== null) {
                            tally[assignee.node.login]['milestones'][issue.milestone.title]['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                        }
                    }
                }

                // 2- Populate by project
                //projectCards.edges[].node.project.name
                if (issue.projectCards.totalCount > 0) {
                    issue.projectCards.edges.forEach((project) => {
                        if (tally[assignee.node.login]['projects'][project.node.project.name] === undefined) {
                            tally[assignee.node.login]['projects'][project.node.project.name] = {
                                project: project.node.project,
                                dates: _.cloneDeep(datesObject)
                            }
                        }
                        if (tally[assignee.node.login]['projects'][project.node.project.name]['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                            tally[assignee.node.login]['projects'][project.node.project.name]['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                            tally[assignee.node.login]['projects'][project.node.project.name]['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                            if (issue.points !== null) {
                                tally[assignee.node.login]['projects'][project.node.project.name]['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                            }
                        }
                    });
                } else {
                    if (tally[assignee.node.login]['projects']['empty']['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                        tally[assignee.node.login]['projects']['empty']['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                        tally[assignee.node.login]['projects']['empty']['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                        if (issue.points !== null) {
                            tally[assignee.node.login]['projects']['empty']['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                        }
                    }
                }

                // 3- Populate by area label, area labels start with area:
                //projectCards.edges[].node.project.name
                if (issue.labels.totalCount > 0) {
                    let areaFound = 0;
                    issue.labels.edges.forEach((label) => {
                        if (label.node.name.slice(0, 5) === 'area:') {
                            areaFound = 1;
                            if (tally[assignee.node.login]['areas'][label.node.name] === undefined) {
                                tally[assignee.node.login]['areas'][label.node.name] = {
                                    label: label.node,
                                    dates: _.cloneDeep(datesObject)
                                }
                            }
                            if (tally[assignee.node.login]['areas'][label.node.name]['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                                tally[assignee.node.login]['areas'][label.node.name]['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                                tally[assignee.node.login]['areas'][label.node.name]['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                                if (issue.points !== null) {
                                    tally[assignee.node.login]['areas'][label.node.name]['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                                }
                            }
                        }
                    });
                    if (areaFound === 0) {
                        if (tally[assignee.node.login]['areas']['empty']['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                            tally[assignee.node.login]['areas']['empty']['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                            tally[assignee.node.login]['areas']['empty']['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                            if (issue.points !== null) {
                                tally[assignee.node.login]['areas']['empty']['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                            }
                        }
                    }
                }
            }); // End assignees.each()
        }
        return tally;
    }, {});
    //Convert dataObject to array
    let dataArray = Object.values(dataObject);
    dataArray = dataArray.map((assignee) => {
        return {
            ...assignee,
            all: Object.values(assignee.all),
            areas: Object.values(assignee.areas).map((area) => {
                return {
                    label: area.label,
                    dates: Object.values(area.dates)
                }
            }),
            milestones: Object.values(assignee.milestones).map((milestone) => {
                return {
                    milestone: milestone.milestone,
                    dates: Object.values(milestone.dates)
                }
            }),
            projects: Object.values(assignee.projects).map((project) => {
                return {
                    project: project.project,
                    dates: Object.values(project.dates)
                }
            }),
        }
    });
    return dataArray;
};

/*
*
* formatDate() Take out hours, minutes and seconds from a date string and return date object
*
* Arguments:
* - dateString: Date string
*/
//TODO - To be removed, has been moved to shared.js
export const formatDate = (dateString) => {
    let day = new Date(dateString);
    day.setUTCHours(0);
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    return day
};

/*
*
* getWeekYear() Get the current week from a date object
*
* Arguments:
* - dateObj: Date object
*/
export const getWeekYear = (dateObj) => {
    var jan4th = new Date(dateObj.getFullYear(),0,4);
    return Math.ceil((((dateObj - jan4th) / 86400000) + jan4th.getDay()+1)/7);
};

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
        firstDay.setDate(firstDay.getDate() - 1);
        return firstDay
    } else {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        //return new Date();
        return date;
    }
};

/*
*
* getLastDay() Return the last day from a minimongo dataset
*
* Arguments:
* - mongoFilter: Filter to be applied to minimongo
* - cfgIssues: Minimongo instance
*/
//TODO - To be removed, has been moved to shared.js
export const getLastDay = (mongoFilter, cfgIssues) => {
    if (cfgIssues.find(mongoFilter).count() > 0) {
        let lastDay = formatDate(cfgIssues.findOne(mongoFilter, {
            sort: {closedAt: -1},
            reactive: false,
            transform: null
        }).closedAt);
        lastDay.setDate(lastDay.getDate() + 1);
        return lastDay
    } else {
        return new Date() + 1;
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
    let initObject = {};
    let currentDate = firstDay;
    while(currentDate < lastDay) {
        currentDate.setDate(currentDate.getDate() + 1);
        initObject[currentDate.toJSON().slice(0, 10)] = {
            date: currentDate.toJSON(),
            list: [],
            issues: 0,
            points: 0,
        };
    }
    return initObject;
};
