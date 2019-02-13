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
        nullKey: 'milestone',
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
        nullKey: 'assignees.totalCount',
        nullFilter: {'assignees.totalCount': { $eq : 0 }},
        nested: true,
        nestedKey: 'login',
        aggregations: {}
    },
    labels: {
        key: 'labels',
        name: 'Labels',
        nullValue: 'NO LABEL',
        nullKey: 'labels.totalCount',
        nullFilter: {'labels.totalCount': { $eq : 0 }},
        nested: true,
        nestedKey: 'name',
        aggregations: {}
    },
};

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
    // This portion remove the actual filter to ensure that if one value from a facet is selected, all the other values also show up (to support OR like mechanism)
    // Three use cases:
    // 1- The value is selected
    // 2- A null value is selected
    // 3- Both a null value of a regular value are selected (.i.e there is an "OR" statement).
    // {
    //   $or:[
    //    {
    //      "assignees.edges":{
    //          "$elemMatch":{
    //              "node.login":{
    //                  "$in":["denis-yuen","agduncan94"]
    //              }
    //          }
    //      }
    //    },
    //    {
    //      'assignees.totalCount': { $eq : 0 }}]}
    // Note: There might be multiple OR statements in one query, have to find which one

    if (facetQuery[queryElement] !== undefined) {
        delete facetQuery[queryElement];
    } else if (facetQuery[facet.nullKey] !== undefined) {
        delete facetQuery[facet.nullKey];
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
                    if (nestedValue.node[facet.nestedKey] === null || nestedValue.node[facet.nestedKey] === '' || nestedValue.node[facet.nestedKey] === undefined ) {
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
