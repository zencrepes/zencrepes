import _ from 'lodash';

const aggregationsModel = {
    ids: {
        key: 'id',
        name: 'Issue Id',
        nested: false,
        aggregations: {},
        hiddenFacet: true,
    },
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
    projects: {
        key: 'projectCards',
        name: 'Project',
        nullValue: 'NO LABEL',
        nullFilter: {'projectCards.totalCount': { $eq : 0 }},
        nested: true,
        nestedKey: 'project.name',
        aggregations: {}
    },
};

// NOTE: The query/facets mechanism currently doesn't support querying on multiple fields with the same "key".
// It is not possible to get both project name and project column for example

/*
*
* initFacets() Build facets from a query
*
* Arguments:
* - query: Query used as source for facets building
* - cfgIssues: Minimongo instance
*/
export const buildFacets = (query, cfgIssues) => {
    /*
    let aggregations = Object.entries(aggregationsModel).map(([facet, content]) => {
        return content
    });
    */
    let aggregations = Object.keys(aggregationsModel).map((key) => {
        return aggregationsModel[key];
    });
    return aggregations.map((facet) => {
        let facetValues = {};
        if (facet.hiddenFacet === undefined) {
            facetValues = buildFacetValues(query, cfgIssues, facet);
        }
        return {
            ...facet,
            values: facetValues
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
                allValues.push({...pushObj, issue: issue});
            } else {
                issue[facet.key].edges.map((nestedValue) => {
                    // Using lodash get was needed due to the nested nature of some of the facets.
                    if (_.get(nestedValue.node, facet.nestedKey) === null || _.get(nestedValue.node, facet.nestedKey) === '' || _.get(nestedValue.node, facet.nestedKey) === undefined ) {
                        //console.log({...nestedValue.node, name: nestedValue.node.login});
                        allValues.push({...nestedValue.node, name: nestedValue.node.login});
                    } else {
                        allValues.push({...nestedValue.node, issue: issue});
                    }
                })
            }
        });
        statesGroup = _.groupBy(allValues, facet.nestedKey);
    } else {
        //statesGroup = _.groupBy(cfgIssues.find(facetQuery).fetch(), facet.key);
        statesGroup = _.groupBy(cfgIssues.find(facetQuery).fetch(), facet.key);
    }
    // If the key is 'undefined', replace with default facet name
    if (statesGroup['undefined'] !== undefined) {
        statesGroup[facet.nullName] = statesGroup['undefined'];
        delete statesGroup['undefined'];
    }

    return Object.entries(statesGroup)
        .map(([name, content]) => {
            return {
                name: name,
                //issues: Object.values(content),
                count: Object.values(content).length,
                points: Object.values(content).map((node) => {
                    if (node.issue !== undefined) { return node.issue.points;}
                    else {return node.points;}
                }).reduce((acc, points) => acc + points, 0)
            }
        });

};
