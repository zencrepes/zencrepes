import _ from 'lodash';

const aggregationsModel = {
    ids: {
        key: 'id',
        name: 'Milestone Id',
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
    name: {
        key: 'name',
        name: 'Names',
        nested: false,
        aggregations: {}
    },
    color: {
        key: 'color',
        name: 'Colors',
        nested: false,
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
export const buildFacets = (query, miniMongo) => {
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
            facetValues = buildFacetValues(query, miniMongo, facet);
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
* - miniMongo: Minimongo instance
*/
const buildFacetValues = (query, miniMongo, facet) => {
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
        miniMongo.find(facetQuery).forEach((issue) => {
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
        //statesGroup = _.groupBy(miniMongo.find(facetQuery).fetch(), facet.key);
        statesGroup = _.groupBy(miniMongo.find(facetQuery).fetch(), facet.key);
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
            }
        });

};
