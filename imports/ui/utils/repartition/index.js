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
* getRepositoriesRepartition() Take a list of milestones and issues and returns repartition by repository
*
* Arguments:
* - issues: Array of issues
*/
export const getRepositoriesRepartition = (milestones, issues) => {
    const repos = milestones.map((ms) => {
        let issuesList = issues.filter(issue => ms.repo.id === issue.repo.id);
        return {
            ...ms,
            issues: {
                totalCount: ms.issues.totalCount,
                list: issuesList,
                count: issuesList.length
            },
            points: {
                count: issuesList.map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            }
        }
    });
    /*
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
    */
    return repos;
};

export const getLabelsRepartition = (issues) => {
    console.log('getLabelsRepartition');
    let statesGroup = [];
    let allValues = [];
    issues.forEach((issue) => {
        if (issue['labels'].totalCount === 0) {
            let issueCopy = JSON.parse(JSON.stringify(issue));
            issueCopy.label = {name: 'NO LABELS'};
            allValues.push(issueCopy);
        } else {
            issue['labels'].edges.forEach((label) => {
                let issueCopy = JSON.parse(JSON.stringify(issue));
                issueCopy.label = label.node;
                allValues.push(issueCopy);
            });
        }
    });
    statesGroup = _.groupBy(allValues, (value) => value.label.name);

    let labels = []
    Object.keys(statesGroup).forEach(function(key) {
        labels.push({
            ...statesGroup[key][0].label,
            issues: {
                list: statesGroup[key],
                count: statesGroup[key].length
            },
            points: {
                count: statesGroup[key].map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            },
        });
    });

    return labels.sort((a, b) => b.issues.count - a.issues.count);
};
