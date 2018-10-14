/*
*
* getAssigneesRepartition() Take a list of issues and returns repartition by assignees
*
* Arguments:
* - issues: Array of issues
*/

import {cfgIssues, cfgSources} from "../../data/Minimongo";

export const getAssignees = (issues) => {
    console.log('getAssignees');

    let statesGroup = [];

    let allValues = [];
    issues.forEach((issue) => {
//        console.log(issue);
        if (issue['assignees'].totalCount > 0) {
            issue['assignees'].edges.map((assignee) => {
                issue.assignee = assignee.node;
                allValues.push(issue);
            });
        }
    });
    statesGroup = _.groupBy(allValues, (value) => value.assignee.login);

    let assignees = []
    Object.keys(statesGroup).forEach(function(key) {
        assignees.push(statesGroup[key][0].assignee);
    });

    return assignees;
}

export const getAssigneesRepartition = (issues) => {
    console.log('getAssignees');
    let statesGroup = [];
    let allValues = [];
    issues.forEach((issue) => {
        if (issue['assignees'].totalCount === 0) {
            let issueCopy = JSON.parse(JSON.stringify(issue));
            issueCopy.assignee = {login: 'UNASSIGNED'};
            allValues.push(issueCopy);
        } else {
            issue['assignees'].edges.forEach((assignee) => {
                let issueCopy = JSON.parse(JSON.stringify(issue));
                issueCopy.assignee = assignee.node;
                allValues.push(issueCopy);
            });
        }
    });
    statesGroup = _.groupBy(allValues, (value) => value.assignee.login);

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

export const getRepositories = (issues) => {
    let repos = [];
    statesGroup = _.groupBy(issues, (value) => value.repo.name);
    Object.keys(statesGroup).forEach(function(key) {
        repos.push({
            id: statesGroup[key][0].repo.id,
            org: statesGroup[key][0].repo.org,
            name: statesGroup[key][0].repo.name,
            url: statesGroup[key][0].repo.url,
        });
    });
    return repos;
};
/*
*
* getRepositoriesRepartition() Take a list of issues and returns repartition by repository
*
* Arguments:
* - issues: Array of issues
*/
export const getRepositoriesRepartition = (issues) => {
    let repos = [];
    statesGroup = _.groupBy(issues, (value) => value.repo.name);
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

