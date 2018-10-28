import _ from 'lodash';

import {
    formatDate,
    getLastDay,
    populateOpen,
} from '../shared.js';
import {cfgIssues} from "../../data/Minimongo";

const aggregationsModel = {
    repos: {
        key: 'repo.name',
        name: 'Repositories',
        nested: false,
        aggregations: {}
    },
    orgs: {
        key: 'org.name',
        name: 'Organizations',
        nested: false,
        aggregations: {}
    },
    states: {
        key: 'state',
        name: 'States',
        nested: false,
        aggregations: {}
    },
    authors: {
        key: 'author.login',
        name: 'Authors',
        nested: false,
        aggregations: {}
    },
    milestones: {
        key: 'milestone.title',
        name: 'Milestones',
        nullValue: 'NO MILESTONE',
        nullFilter: {'milestone': { $eq : null }},
        nested: false,
        aggregations: {}
    },
    milestonesStates: {
        key: 'milestone.state',
        name: 'Milestones States',
        nested: false,
        aggregations: {}
    },
    assignees: {
        key: 'assignees',
        name: 'Assignees',
        nullValue: 'UNASSIGNED',
        nullFilter: {'assignees.totalCount': { $eq : 0 }},
        nested: true,
        nestedKey: 'login',
        aggregations: {}
    },
    labels: {
        key: 'labels',
        name: 'Labels',
        nullValue: 'NO LABEL',
        nullFilter: {'labels.totalCount': { $eq : 0 }},
        nested: true,
        nestedKey: 'name',
        aggregations: {}
    },
};

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
            ...content,
            //key: content.key,
            //name: content.name,
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

//        aggregations = populateNested(aggregations, 'assignees', 'login', issue);
//        aggregations = populateNested(aggregations, 'labels', 'name', issue);

        // Assignee
//        if (issue.assignees.totalCount < 0) {
//            console.log('Has an issue');
//        }
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

/*
*
* initFacets() Build facets from a query
*
* Arguments:
* - query: Query used as source for facets building
* - cfgIssues: Minimongo instance
*/
export const initFacets = (query, cfgIssues) => {
    console.log('initFacets');
    let aggregations = Object.entries(aggregationsModel).map(([facet, content]) => {
        return content
    });

    return aggregations.map((facet) => {
        return {
            ...facet,
            values: buildFacetValues(query, cfgIssues, facet).sort((a, b) => b.issues.length - a.issues.length)
        };
    });
};

/*
*
* buildFacetValues() Build all facet values corresponding to a particular query
*
* Arguments:
* - query: Query used as source for facets building
* - cfgIssues: Minimongo instance
*/
const buildFacetValues = (query, cfgIssues, facet) => {
    console.log('buildFacetValues');

    //1- Query Manipulation
    let facetQuery = JSON.parse(JSON.stringify(query));
    let queryElement = facet.key;
    if (facet.nested === true) {
        queryElement = facet.key + '.edges';
    }
    if (facetQuery[queryElement] !== undefined) {
        delete facetQuery[queryElement];
    }

    /*
    {
    "assignees.edges":{"$elemMatch":{"node.login":{"$in":["lepsalex","hlminh2000"]}}}
    ,"milestone.state":{"$in":["OPEN"]}
    ,"org.name":{"$in":["Human Cancer Models Initiative - Catalog","Kids First Data Resource Center"]}}
    */

    let statesGroup = {};
    if (facet.nested === true) {
        let allValues = [];
        cfgIssues.find(facetQuery).forEach((issue) => {
            if (issue[facet.key].totalCount === 0) {
                let pushObj = {};
                pushObj[facet.nestedKey] = facet.nullValue;
                allValues.push(pushObj);
            } else {
                issue[facet.key].edges.map((nestedValue) => {
                    if (nestedValue.node[facet.nestedKey] === null || nestedValue.node[facet.nestedKey] === '' || nestedValue.node[facet.nestedKey] === undefined ) {
                        //console.log({...nestedValue.node, name: nestedValue.node.login});
                        allValues.push({...nestedValue.node, name: nestedValue.node.login});
                    } else {
                        allValues.push(nestedValue.node);
                    }
                })
            }
        });
        //console.log(allValues);
        statesGroup = _.groupBy(allValues, facet.nestedKey);
    } else {
        statesGroup = _.groupBy(cfgIssues.find(facetQuery).fetch(), facet.key);
    }
    //console.log(statesGroup);
    // If the key is 'undefined', replace with default facet name
    if (statesGroup['undefined'] !== undefined) {
        statesGroup[facet.nullName] = statesGroup['undefined'];
        delete statesGroup['undefined'];
    }

    return Object.entries(statesGroup)
        .map(([name, content]) => {
            return {
                name: name,
                issues: Object.values(content),
                count: Object.values(content).length,
                points: Object.values(content).map(i => i.points).reduce((acc, points) => acc + points, 0)
            }
        });

};
