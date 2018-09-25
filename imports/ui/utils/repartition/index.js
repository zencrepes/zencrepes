/*
*
* getAssigneesRepartition() Take a list of issues and returns repartition by assignees
*
* Arguments:
* - issues: Array of issues
*/

import {cfgIssues, cfgSources} from "../../data/Minimongo";

export const getAssigneesRepartition = (issues) => {
    console.log('getAssignees');

    let statesGroup = [];

    let allValues = [];
    issues.forEach((issue) => {
        if (issue['assignees'].totalCount === 0) {
            issue.assignee = {login: 'UNASSIGNED'};
            allValues.push(issue);
        } else {
            issue['assignees'].edges.map((assignee) => {
                issue.assignee = assignee.node;
                allValues.push(issue);
            });
        }
    });
    console.log(allValues);
    statesGroup = _.groupBy(allValues, (value) => value.assignee.login);
    console.log(statesGroup);

    let assignees = []
    Object.keys(statesGroup).forEach(function(key) {
        assignees.push({
            ...statesGroup[key][0].assignee,
            issues: {
                list: statesGroup[key],
                count: statesGroup[key].length
            },
            points: {
                count: statesGroup[key].map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            },
        });
    });

    /*
    // If the key is 'undefined', replace with default facet name
    if (statesGroup['undefined'] !== undefined) {
        statesGroup['UNASSIGNED'] = statesGroup['undefined'];
        delete statesGroup['undefined'];
    }
*/
    /*
    let states = [];
    Object.keys(statesGroup).forEach(function(key) {
        states.push({count: statesGroup[key].length, login: key });
    });
    */
    //Return the array sorted by count
    return assignees.sort((a, b) => b.issues.count - a.issues.count);
};

/*
export const getAssigneesRepartition = (issues) => {
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
    console.log(allValues);
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
};
*/
/*
*
* getRepositoriesRepartition() Take a list of issues and returns repartition by repository
*
* Arguments:
* - issues: Array of issues
*/
export const getRepositoriesRepartition = (issues) => {
    let repos = [];
    statesGroup = _.groupBy(issues, 'repo.name');
    Object.keys(statesGroup).forEach(function(key) {
        repos.push({
            id: statesGroup[key][0].repo.id,
            org: statesGroup[key][0].repo.org,
            name: statesGroup[key][0].repo.name,
            url: statesGroup[key][0].repo.url,
            issues: {
                list: statesGroup[key],
                count: statesGroup[key].length
            },
            points: {
                count: statesGroup[key].map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            },
        });
    });
    return repos;
};

