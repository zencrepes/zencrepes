import _ from 'lodash';

/*
*
* getAssigneesRepartition() Take a list of issues and returns repartition by assignees
*
* Arguments:
* - issues: Array of issues
*/
export const getAssignees = (issues) => {
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
};

export const getAssigneesRepartition = (issues) => {
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

    let assignees = [];
    Object.keys(statesGroup).forEach(function(key) {
        assignees.push({
            ...statesGroup[key][0].assignee,
            issues: {
                list: statesGroup[key],
                count: statesGroup[key].length,
                points: statesGroup[key].map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            },
            points: {
                count: statesGroup[key].map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            },
        });
    });

    return assignees.sort((a, b) => b.issues.count - a.issues.count);
};

export const getMilestonesRepartition = (issues) => {
    let statesGroup = [];
    let allValues = [];
    issues.forEach((issue) => {
        if (issue.milestone === null) {
            let issueCopy = JSON.parse(JSON.stringify(issue));
            issueCopy.milestone = {title: 'NO MILESTONE'};
            allValues.push(issueCopy);
        } else {
            allValues.push(issue);
        }
    });

    statesGroup = _.groupBy(allValues, (value) => value.milestone.title);

    let milestones = []
    Object.keys(statesGroup).forEach(function(key) {
        milestones.push({
            ...statesGroup[key][0].milestone,
            issues: {
                list: statesGroup[key],
                count: statesGroup[key].length
            },
            points: {
                count: statesGroup[key].map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            },
        });
    });
    return milestones.sort((a, b) => b.issues.count - a.issues.count);
};

export const getMilestonesRepartitionById = (issues) => {
    let statesGroup = [];
    statesGroup = _.groupBy(issues, (value) => value.milestone.id);

    let milestones = []
    Object.keys(statesGroup).forEach(function(key) {
        milestones.push({
            ...statesGroup[key][0].milestone,
            issues: {
                list: statesGroup[key],
                count: statesGroup[key].length
            },
            points: {
                count: statesGroup[key].map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            },
        });
    });
    return milestones.sort((a, b) => b.issues.count - a.issues.count);
};

export const getRepositories = (issues) => {
    let repos = [];
    let statesGroup = _.groupBy(issues, (value) => value.repo.name);
    Object.keys(statesGroup).forEach(function(key) {
        let issuesList = statesGroup[key];
        repos.push({
            id: statesGroup[key][0].repo.id,
            org: statesGroup[key][0].repo.org,
            name: statesGroup[key][0].repo.name,
            url: statesGroup[key][0].repo.url,
            issues: {
                totalCount: statesGroup[key][0].repo.issues.totalCount,
                list: issuesList,
                count: issuesList.length
            },
            points: {
                count: issuesList.map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            }
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

export const getColumnsRepartition = (issues, projectName) => {
    let statesGroup = [];
    let allValues = [];
    issues.forEach((issue) => {
        if (issue['projectCards'].totalCount === 0) {
            let issueCopy = JSON.parse(JSON.stringify(issue));
            issueCopy.column = {name: 'NO PROJECT SET'};
            allValues.push(issueCopy);
        } else {
            issue['projectCards'].edges.forEach((card) => {
                //Discard issues not part of the project
                if (card.node.project.name === projectName) {
                    let issueCopy = JSON.parse(JSON.stringify(issue));
                    if (card.node.column === null) {
                        issueCopy.column = {name: 'NO COLUMN SET'};
                    } else {
                        issueCopy.column = card.node.column;
                    }
                    allValues.push(issueCopy);
                }
            });
        }
    });
    statesGroup = _.groupBy(allValues, (value) => value.column.name);

    let columns = [];
    Object.keys(statesGroup).forEach(function(key) {
        columns.push({
            ...statesGroup[key][0].column,
            issues: {
                list: statesGroup[key],
                count: statesGroup[key].length
            },
            points: {
                count: statesGroup[key].map(issue => issue.points). reduce((acc, count) => acc + count, 0)
            },
        });
    });

    return columns.sort((a, b) => b.issues.count - a.issues.count);
};
