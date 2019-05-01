import _ from 'lodash';
import subDays from 'date-fns/subDays';

/*
*
* refreshAssigneesContributions() Takes an array of issues and build a matrix of individual contributions per day
*
* Arguments:
* - issues: Array of issues
*/
export const refreshAssigneesContributions = (issues, area_prefix) => {
    //Build an array of days corresponding to the interval
    //let firstDay = formatDate(firstIssue.closedAt);
    let firstDay = formatDate(subDays(new Date(), 28));
    let lastDay = subDays(new Date(), 1);

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
                        projects: {empty: {project: null, total: {issues: 0, points: 0, list: []}, dates: _.cloneDeep(datesObject)}},
                        milestones: {empty: {milestone: null, total: {issues: 0, points: 0, list: []}, dates: _.cloneDeep(datesObject)}},
                        areas: {empty: {label: null, total: {issues: 0, points: 0, list: []}, dates: _.cloneDeep(datesObject)}},
                        all: {total: {issues: 0, points: 0, list: []}, dates: _.cloneDeep(datesObject)},
                    }
                }
                // 1- Populate the all section
                if (tally[assignee.node.login]['all']['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                    tally[assignee.node.login]['all']['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                    tally[assignee.node.login]['all']['total']['issues']++;
                    tally[assignee.node.login]['all']['total']['list'].push(issue);
                    tally[assignee.node.login]['all']['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                    if (issue.points !== null) {
                        tally[assignee.node.login]['all']['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                        tally[assignee.node.login]['all']['total']['points'] += issue.points;
                    }
                }

                // 2- Populate by milestone
                if (issue.milestone === null) {
                    if (tally[assignee.node.login]['milestones']['empty'][issue.closedAt.slice(0, 10)] !== undefined) {
                        tally[assignee.node.login]['milestones']['empty']['total']['issues']++;
                        tally[assignee.node.login]['milestones']['empty']['total']['list'].push(issue);
                        tally[assignee.node.login]['milestones']['empty'][issue.closedAt.slice(0, 10)]['issues']++;
                        tally[assignee.node.login]['milestones']['empty'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                        if (issue.points !== null) {
                            tally[assignee.node.login]['milestones']['empty'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                            tally[assignee.node.login]['milestones']['empty']['total']['points'] += issue.points;
                        }
                    }
                } else {
                    if (tally[assignee.node.login]['milestones'][issue.milestone.title] === undefined) {
                        tally[assignee.node.login]['milestones'][issue.milestone.title] = {
                            milestone: issue.milestone,
                            total: {issues: 0, points: 0, list:[]},
                            dates: _.cloneDeep(datesObject)
                        }
                    }
                    if (tally[assignee.node.login]['milestones'][issue.milestone.title]['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                        tally[assignee.node.login]['milestones'][issue.milestone.title]['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                        tally[assignee.node.login]['milestones'][issue.milestone.title]['total']['issues']++;
                        tally[assignee.node.login]['milestones'][issue.milestone.title]['total']['list'].push(issue);
                        tally[assignee.node.login]['milestones'][issue.milestone.title]['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                        if (issue.points !== null) {
                            tally[assignee.node.login]['milestones'][issue.milestone.title]['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                            tally[assignee.node.login]['milestones'][issue.milestone.title]['total']['points'] += issue.points;
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
                                total: {issues: 0, points: 0, list:[]},
                                dates: _.cloneDeep(datesObject)
                            }
                        }
                        if (tally[assignee.node.login]['projects'][project.node.project.name]['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                            tally[assignee.node.login]['projects'][project.node.project.name]['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                            tally[assignee.node.login]['projects'][project.node.project.name]['total']['issues']++;
                            tally[assignee.node.login]['projects'][project.node.project.name]['total']['list'].push(issue);
                            tally[assignee.node.login]['projects'][project.node.project.name]['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                            if (issue.points !== null) {
                                tally[assignee.node.login]['projects'][project.node.project.name]['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                                tally[assignee.node.login]['projects'][project.node.project.name]['total']['points'] += issue.points;
                            }
                        }
                    });
                } else {
                    if (tally[assignee.node.login]['projects']['empty']['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                        tally[assignee.node.login]['projects']['empty']['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                        tally[assignee.node.login]['projects']['empty']['total']['issues']++;
                        tally[assignee.node.login]['projects']['empty']['total']['list'].push(issue);
                        tally[assignee.node.login]['projects']['empty']['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                        if (issue.points !== null) {
                            tally[assignee.node.login]['projects']['empty']['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                            tally[assignee.node.login]['projects']['empty']['total']['points'] += issue.points;
                        }
                    }
                }

                // 3- Populate by area label, area labels start with area:
                //projectCards.edges[].node.project.name
                if (issue.labels.totalCount > 0) {
                    let areaFound = 0;
                    issue.labels.edges.forEach((label) => {
                        if (label.node.name.slice(0, 5) === area_prefix) {
                            areaFound = 1;
                            if (tally[assignee.node.login]['areas'][label.node.name] === undefined) {
                                tally[assignee.node.login]['areas'][label.node.name] = {
                                    label: label.node,
                                    total: {issues: 0, points: 0, list:[]},
                                    dates: _.cloneDeep(datesObject)
                                }
                            }
                            if (tally[assignee.node.login]['areas'][label.node.name]['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                                tally[assignee.node.login]['areas'][label.node.name]['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                                tally[assignee.node.login]['areas'][label.node.name]['total']['issues']++;
                                tally[assignee.node.login]['areas'][label.node.name]['total']['list'].push(issue);
                                tally[assignee.node.login]['areas'][label.node.name]['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                                if (issue.points !== null) {
                                    tally[assignee.node.login]['areas'][label.node.name]['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                                    tally[assignee.node.login]['areas'][label.node.name]['total']['points'] += issue.points;
                                }
                            }
                        }
                    });
                    if (areaFound === 0) {
                        if (tally[assignee.node.login]['areas']['empty']['dates'][issue.closedAt.slice(0, 10)] !== undefined) {
                            tally[assignee.node.login]['areas']['empty']['dates'][issue.closedAt.slice(0, 10)]['issues']++;
                            tally[assignee.node.login]['areas']['empty']['total']['issues']++;
                            tally[assignee.node.login]['areas']['empty']['total']['list'].push(issue);
                            tally[assignee.node.login]['areas']['empty']['dates'][issue.closedAt.slice(0, 10)]['list'].push(issue);
                            if (issue.points !== null) {
                                tally[assignee.node.login]['areas']['empty']['dates'][issue.closedAt.slice(0, 10)]['points'] += issue.points;
                                tally[assignee.node.login]['areas']['empty']['total']['points'] += issue.points;
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
            all: {
                total: assignee.all.total,
                dates: Object.values(assignee.all.dates)
            },
            areas: Object.values(assignee.areas).map((area) => {
                return {
                    label: area.label,
                    total: area.total,
                    dates: Object.values(area.dates)
                }
            }),
            milestones: Object.values(assignee.milestones).map((milestone) => {
                return {
                    milestone: milestone.milestone,
                    total: milestone.total,
                    dates: Object.values(milestone.dates)
                }
            }),
            projects: Object.values(assignee.projects).map((project) => {
                return {
                    project: project.project,
                    total: project.total,
                    dates: Object.values(project.dates)
                }
            }),
        }
    });
    return dataArray;
};

/*
*
* refreshMilestonesContributions() Takes an array of issues and build a matrix of individual contributions per day
*
* Arguments:
* - issues: Array of issues
*/
export const refreshMilestonesContributions = (issues) => {
    const dataObject = issues.reduce((tally, issue) => {
        if (issue.milestone === null) {
            tally['empty']['total']['issues']++;
            tally['empty']['total']['list'].push(issue);
            if (issue.points !== null) {
                tally['empty']['total']['points'] += issue.points;
            }
        } else {
            if (tally[issue.milestone.title] === undefined) {
                tally[issue.milestone.title] = {
                    milestone: issue.milestone,
                    total: {issues: 0, points: 0, list:[]},
                }
            }
            tally[issue.milestone.title]['total']['issues']++;
            tally[issue.milestone.title]['total']['list'].push(issue);
            if (issue.points !== null) {
                tally[issue.milestone.title]['total']['points'] += issue.points;
            }
        }
        return tally;
    }, {empty: {milestone: null, total: {issues: 0, points: 0, list: []}}});
    //Convert dataObject to array
    let dataArray = Object.values(dataObject);
    return dataArray.map((d) => {
        let name = 'NO MILESTONE';
        if (d.milestone !== null) {name = d.milestone.title;}
        return {
            name: name,
            count: d.total.issues,
            points: d.total.points,
            issues: d.total.list
        }
    });
};

/*
*
* refreshProjectsContributions() Takes an array of issues and build a matrix of individual contributions per day
*
* Arguments:
* - issues: Array of issues
*/
export const refreshProjectsContributions = (issues) => {
    const dataObject = issues.reduce((tally, issue) => {
        if (issue.projectCards.totalCount === 0) {
            tally['empty']['total']['issues']++;
            tally['empty']['total']['list'].push(issue);
            if (issue.points !== null) {
                tally['empty']['total']['points'] += issue.points;
            }
        } else {
            issue.projectCards.edges.forEach((project) => {
                if (tally[project.node.project.name] === undefined) {
                    tally[project.node.project.name] = {
                        project: project.node.project,
                        total: {issues: 0, points: 0, list:[]},
                    }
                }
                tally[project.node.project.name]['total']['issues']++;
                tally[project.node.project.name]['total']['list'].push(issue);
                tally[project.node.project.name]['total']['points'] += issue.points;
            });
        }
        return tally;
    }, {empty: {project: null, total: {issues: 0, points: 0, list: []}}});
    //Convert dataObject to array
    let dataArray = Object.values(dataObject);
    return dataArray.map((d) => {
        let name = 'NO PROJET';
        if (d.project !== null) {name = d.project.name;}
        return {
            name: name,
            count: d.total.issues,
            points: d.total.points,
            issues: d.total.list
        }
    });
};

/*
*
* refreshAreasContributions() Takes an array of issues and build a matrix of individual contributions per day
*
* Arguments:
* - issues: Array of issues
*/
export const refreshAreasContributions = (issues, area_prefix) => {
    const dataObject = issues.reduce((tally, issue) => {
        if (issue.labels.totalCount > 0) {
            let areaFound = 0;
            issue.labels.edges.forEach((label) => {
                if (label.node.name.slice(0, 5) === area_prefix) {
                    areaFound = 1;
                    if (tally[label.node.name] === undefined) {
                        tally[label.node.name] = {
                            label: label.node,
                            total: {issues: 0, points: 0, list:[]},
                        }
                    }
                    tally[label.node.name]['total']['issues']++;
                    tally[label.node.name]['total']['list'].push(issue);
                    if (issue.points !== null) {
                        tally[label.node.name]['total']['points'] += issue.points;
                    }
                }
            });
            if (areaFound === 0) {
                tally['empty']['total']['issues']++;
                tally['empty']['total']['list'].push(issue);
                tally['empty']['total']['points'] += issue.points;
            }
        }
        return tally;
    }, {empty: {label: null, total: {issues: 0, points: 0, list: []}}});
    //Convert dataObject to array
    let dataArray = Object.values(dataObject);
    return dataArray.map((d) => {
        let name = 'NO AREA';
        if (d.label !== null) {name = d.label.name;}
        return {
            name: name,
            count: d.total.issues,
            points: d.total.points,
            issues: d.total.list
        }
    });
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
