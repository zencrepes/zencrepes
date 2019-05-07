import _ from 'lodash';

/*
*
* fetchGraphIssues() Takes an array of issues, and walk the tree to find all possible issues associations
*
* Arguments:
* - issues: Array of issues
* - cfgIssues: Minimongo instance
*/
export const fetchGraphIssues = (issues, cfgIssues) => {
    const individualIssues = [];
    const distance = 0;
    issues.forEach((issue) => {
        if (_.findIndex(individualIssues, {id: issue.id}) === -1) {
            const node = {
                id: issue.id,
                group: 'nodes',
                label: issue.title,
                data: {
                    ...issue,
                    distance: 0
                }
            };
            individualIssues.push(node);
            exploreGraph(issue, cfgIssues, individualIssues, distance);
        }
    });
    return individualIssues;
};

const exploreGraph = (issue, cfgIssues, individualIssues, distance) => {
    const links = [...issue.linkedIssues.target, ...issue.linkedIssues.source];
    links.forEach((link) => {
        if (_.findIndex(individualIssues, {id: link.id}) === -1) {
            let foundIssue = cfgIssues.findOne({id: link.id});
            if (foundIssue === undefined) {
                foundIssue = {...link, partial: true};
            }
            const node = {
                id: foundIssue.id,
                label: foundIssue.title,
                group: 'nodes',
                data: {
                    ...foundIssue,
                    disance: distance + 1,
                }
            };
            individualIssues.push(node);
            // If issue isn't partial, we can go into finding the neighbors
            if (foundIssue.partial === undefined) {
                exploreGraph(foundIssue, cfgIssues, individualIssues, distance + 1);
            }
        }
    });
};