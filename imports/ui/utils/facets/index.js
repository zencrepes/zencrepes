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

const aggregationsModel = {
    repos: {key: 'repos', name: 'Repositories', aggregations: {}},
    orgs: {key: 'orgs', name: 'Organizations', aggregations: {}},
    states: {key: 'states', name: 'States', aggregations: {}},
    authors: {key: 'authors', name: 'Authors', aggregations: {}},
    milestones: {key: 'milestones', name: 'Milestones', aggregations: {}},
    milestonesStates: {key: 'milestonesStates', name: 'Milestones States', aggregations: {}},
    assignees: {key: 'assignees', name: 'Assignees', aggregations: {}},
    labels: {key: 'labels', name: 'Labels', aggregations: {}},
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
            key: content.key,
            name: content.name,
            values: Object.entries(content.aggregations)
                .map(([name, content]) => {
                    return {
                        name: name,
                        issues: Object.values(content),
                        count: Object.values(content).length,
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
export const buildAggregations = (issues) => {
    /*
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
    */
    let aggregations = JSON.parse(JSON.stringify(aggregationsModel));
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
    if (aggregations[aggIdx].aggregations[itemIdx] === undefined) {
        aggregations[aggIdx].aggregations[itemIdx] = {};
    }
    aggregations[aggIdx].aggregations[itemIdx][issue.id] = issue;
    return aggregations;
};

const populateNested = (aggregations, aggIdx, itemIdx, issue) => {
    if (issue[aggIdx].totalCount > 0) {
        issue[aggIdx].edges.forEach((item) => {
            let idxValue = item.node[itemIdx];
            if (aggregations[aggIdx].aggregations[idxValue] === undefined) {
                aggregations[aggIdx].aggregations[idxValue] = {}
            }
            aggregations[aggIdx].aggregations[idxValue][issue.id] = issue;
        });
    }
    return aggregations;
};