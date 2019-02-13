import _ from 'lodash';

/*
*
* refreshBurndown() Takes a mongo selector (finder) and Initialize an object containing indices for all days between two dates
*
* Arguments:
* - valueName: Value to be added to or removed from the facet
* - facet: Current facet to operate on
* - sourceQuery: Actual query to be updated
*/
export const addRemoveFromQuery = (valueName, facet, sourceQuery) => {

    let modifiedQuery = JSON.parse(JSON.stringify(sourceQuery));

    console.log(valueName);
    console.log(facet);
    console.log(sourceQuery);

    //1- Mutate the modifiedQuery to the corresponding state
    let facetKey = facet.key;
    if (valueName === facet.nullValue) {
        //{
        // $or:[
        //      {"assignees.edges":{"$elemMatch":{"node.login":{"$in":["denis-yuen","agduncan94"]}}}}
        //      , {'assignees.totalCount': { $eq : 0 }}
        // ]
        // }
        console.log('Clicked on nullValue');
        //1- Check if this facet is already in the query
        let nullFacetExists = false;
        if (modifiedQuery['$or'] !== undefined) {
            console.log(_.findIndex(modifiedQuery['$or'], function(o) { return o['assignees.totalCount'] !== undefined; }));
        }
        console.log(nullFacetExists);

        if (nullFacetExists) {
            // If it does exists, we remove and refactor the query
            console.log('Remove and refactor');
        } else {
            // If it does not exits, we add and refactor the query
            console.log('Add and refactor');
            // 1- Check if the facet is already selected
            if (facet.nested === true) {
                facetKey = facetKey + '.edges';
            }
            if (modifiedQuery[facetKey] !== undefined) {
                console.log('The facet already exists');
            } else {
                console.log('The facet does not exist yet');
                modifiedQuery['assignees.totalCount'] = { $eq : 0 };
            }
//            console.log(_.findIndex(modifiedQuery, function(o) { return o['assignees.totalCount'] !== undefined; }));
        }

    } else if (facet.nested === false) {
        if (modifiedQuery[facetKey] === undefined) {
            modifiedQuery[facetKey] = {"$in": [valueName]};
        } else if (modifiedQuery[facetKey]['$in'].includes(valueName)) {
            // Remove element from array
            modifiedQuery[facetKey]['$in'] = modifiedQuery[facetKey]['$in'].filter(i => i !== valueName);
            if (modifiedQuery[facetKey]['$in'].length === 0) {
                delete modifiedQuery[facetKey];
            }
        } else {
            modifiedQuery[facetKey]['$in'].push(valueName);
        }
    } else {
        facetKey = facetKey + '.edges';
        let nestedKey = 'node.' + facet.nestedKey;
        if (modifiedQuery[facetKey] === undefined) {
            modifiedQuery[facetKey] = {'$elemMatch': {}};
            modifiedQuery[facetKey]['$elemMatch'][nestedKey] = {"$in": [valueName]};
        } else if (modifiedQuery[facetKey]['$elemMatch'][nestedKey]['$in'].includes(valueName)) {
            modifiedQuery[facetKey]['$elemMatch'][nestedKey]['$in'] = modifiedQuery[facetKey]['$elemMatch'][nestedKey]['$in'].filter(i => i !== valueName);
            if (modifiedQuery[facetKey]['$elemMatch'][nestedKey]['$in'].length === 0) {
                delete modifiedQuery[facetKey];
            }
        } else {
            modifiedQuery[facetKey]['$elemMatch'][nestedKey]['$in'].push(valueName);
        }
    }
    /*
    {
    "assignees.edges":{"$elemMatch":{"node.login":{"$in":["lepsalex","hlminh2000"]}}}
    ,"milestone.state":{"$in":["OPEN"]}
    ,"org.name":{"$in":["Human Cancer Models Initiative - Catalog","Kids First Data Resource Center"]}}
    */
    return modifiedQuery;
};