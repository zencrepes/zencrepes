import _ from 'lodash';

const aggregationsModel = {
    ids: {
        key: 'id',
        name: 'Repository Id',
        nested: false,
        aggregations: {},
        hiddenFacet: true,
    },
    orgs: {
        key: 'org.name',
        name: 'Organizations',
        nested: false,
        aggregations: {}
    },
    languages: {
        key: 'languages',
        name: 'Languages',
        nullValue: 'EMPTY',
        nullFilter: {'languages.totalCount': { $eq : 0 }},
        nested: true,
        nestedKey: 'name',
        aggregations: {}
    },
    topics: {
        key: 'repositoryTopics',
        name: 'Topics',
        nullValue: 'EMPTY',
        nullFilter: {'repositoryTopics.totalCount': { $eq : 0 }},
        nested: true,
        nestedKey: 'topic.name',
        aggregations: {}
    },    
    protection: {
        key: 'branchProtectionRules',
        name: 'Branch Protection',
        nullValue: 'EMPTY',
        nullFilter: {'branchProtectionRules.totalCount': { $eq : 0 }},
        nested: true,
        nestedKey: 'pattern',
        aggregations: {}
    },
    isArchived: {
        key: 'isArchived',
        name: 'Archived',
        nested: false,
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
export const buildFacets = (query, cfgSources) => {
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
            facetValues = buildFacetValues(query, cfgSources, facet);
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
const buildFacetValues = (query, cfgSources, facet) => {
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
        cfgSources.find(facetQuery).forEach((repository) => {
            if (repository[facet.key] !== undefined) {
                if (repository[facet.key].totalCount === 0) {
                    let pushObj = {};
                    pushObj[facet.nestedKey] = facet.nullValue;
                    allValues.push({...pushObj, repository: repository});
                } else {
                    repository[facet.key].edges.map((nestedValue) => {
                        // Using lodash get was needed due to the nested nature of some of the facets.
                        if (_.get(nestedValue.node, facet.nestedKey) === null || _.get(nestedValue.node, facet.nestedKey) === '' || _.get(nestedValue.node, facet.nestedKey) === undefined) {
                            //console.log({...nestedValue.node, name: nestedValue.node.login});
                            allValues.push({...nestedValue.node, name: nestedValue.node.login});
                        } else {
                            allValues.push({...nestedValue.node, repository: repository});
                        }
                    })
                }
            }
        });
        statesGroup = _.groupBy(allValues, facet.nestedKey);
    } else {
        //statesGroup = _.groupBy(cfgSources.find(facetQuery).fetch(), facet.key);
        statesGroup = _.groupBy(cfgSources.find(facetQuery).fetch(), facet.key);
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
                repositories: Object.values(content).map((repository) => {
                    if (repository.repository !== undefined) {return repository.repository;}
                    else {return repository;}
                }),
                count: Object.values(content).length,
            }
        });

};
