import { cfgIssues } from '../../../data/Minimongo.js';

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

/*
*
* buildAggregations() Loop through an array of issues and return an object containing specific aggregations
*
* Arguments:
* - issues: Array of issues
*/
const buildAggregations = (issues) => {
    let t0 = performance.now();
    let aggregations = {
        repos: {},
        orgs: {},
        states: {},
        authors: {},
        milestones: {},
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

        aggregations = populateNested(aggregations, 'assignees', 'login', issue);
        aggregations = populateNested(aggregations, 'labels', 'name', issue);

        // Assignee
        if (issue.assignees.totalCount < 0) {
            console.log('Has an issue');
        }
    });
    var t1 = performance.now();
    console.log("buildAggregations - took " + (t1 - t0) + " milliseconds.");

    return aggregations;
};

/*
*
* buildFacets() Convert an object containing aggregations and build facets
*
* Arguments:
* - issues: Object of aggregations
*/

const buildFacets = (aggregations) => {
    let t0 = performance.now();

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

    var t1 = performance.now();
    console.log("buildFacets - took " + (t1 - t0) + " milliseconds.");

    return facets;
};

export default {
    state: {
        issues: [],
        facets: [],
    },
    reducers: {
        setIssues(state, payload) {return { ...state, issues: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},
    },
    effects: {
        async initIssues(payload, rootState) {
            console.log('initIssues');
            let issues = cfgIssues.find({}).fetch();
            let aggregations = buildAggregations(issues);
            console.log(aggregations);
            let facets = buildFacets(aggregations);
            console.log(facets);
            this.setFacets(facets);

        }
    }
};

