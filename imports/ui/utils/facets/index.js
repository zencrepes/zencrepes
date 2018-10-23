import {
    formatDate,
    getLastDay,
    populateOpen,
} from '../shared.js';

/*
*
* refreshFacets() Build facets from an array of issues
*
* Arguments:
* - issues: Array of issues
*/
export const refreshFacets = (issues) => {
    let aggregations = buildAggregations(issues);
    let facets = buildFacets(aggregations);

    return facets;
};

/*
*
* buildFacets() Convert an object containing aggregations and build facets
*
* Arguments:
* - issues: Object of aggregations
*/
const buildFacets = (aggregations) => {
    let facets = Object.entries(aggregations).map(([facet, content]) => {
        return {
            name: facet,
            values: Object.entries(content)
                .map(([name, content]) => {
                    return {
                        name: name,
                        issues: Object.values(content),
                        points: Object.values(content).map(i => i.points).reduce((acc, points) => acc + points, 0)
                    }
                })
                .sort((a, b) => b.issues.length - a.issues.length),
        };
    });

    return facets;
};

/*
*
* buildAggregations() Loop through an array of issues and return an object containing specific aggregations
*
* Arguments:
* - issues: Array of issues
*/
const buildAggregations = (issues) => {
    let aggregations = {
        repos: {},
        orgs: {},
        states: {},
        authors: {},
        milestones: {},
        milestonesStates: {},
        assignees: {},
        labels: {},
    };
    issues.forEach((issue) => {
        // Manually build aggregations, limiting iterations to the extreme
        aggregations = populateNonNested(aggregations, 'repos', issue.repo.name, issue);
        aggregations = populateNonNested(aggregations, 'orgs', issue.org.name, issue);
        aggregations = populateNonNested(aggregations, 'states', issue.state, issue);
        aggregations = populateNonNested(aggregations, 'authors', issue.author.login, issue);

        let milestoneValue = 'UNASSIGNED';
        if (issue.milestone !== null) {milestoneValue = issue.milestone.title;}
        aggregations = populateNonNested(aggregations, 'milestones', milestoneValue, issue);

        if (issue.milestone !== null) {
            aggregations = populateNonNested(aggregations, 'milestonesStates', issue.milestone.state, issue);
        }

        aggregations = populateNested(aggregations, 'assignees', 'login', issue);
        aggregations = populateNested(aggregations, 'labels', 'name', issue);

        // Assignee
        if (issue.assignees.totalCount < 0) {
            console.log('Has an issue');
        }
    });

    return aggregations;
};

const populateNonNested = (aggregations, aggIdx, itemIdx, issue) => {
    if (aggregations[aggIdx][itemIdx] === undefined) {
        aggregations[aggIdx][itemIdx] = {};
    }
    aggregations[aggIdx][itemIdx][issue.id] = issue;
    return aggregations;
};

const populateNested = (aggregations, aggIdx, itemIdx, issue) => {
    if (issue[aggIdx].totalCount > 0) {
        issue[aggIdx].edges.forEach((item) => {
            let idxValue = item.node[itemIdx];
            if (aggregations[aggIdx][idxValue] === undefined) {
                aggregations[aggIdx][idxValue] = {}
            }
            aggregations[aggIdx][idxValue][issue.id] = issue;
        });
    }
    return aggregations;
};