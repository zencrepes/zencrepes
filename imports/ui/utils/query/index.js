/*
*
* addRemoveFromQuery() Build a mongo selector to update a query
*
* Arguments:
* - valueName: Value to be added to or removed from the facet
* - facet: Current facet to operate on
* - sourceQuery: Actual query to be updated
*/
export const addRemoveFromQuery = (valueName, facet, sourceQuery) => {

    let modifiedQuery = JSON.parse(JSON.stringify(sourceQuery));

    //1- Mutate the modifiedQuery to the corresponding state
    let facetKey = facet.key;
    if (facet.nested === false) {
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

/*
*
* addRemoveDateFromQuery() Build a mongo selector to update a query
*
* Arguments:
* - field: field to be tested against
* - direction: direction for the test (before or after)
* - date: Date to test against
* - sourceQuery: Actual query to be updated
*/
export const addRemoveDateFromQuery = (field, direction, date, sourceQuery) => {
    //issues.find({createdAt:{'$lte':'2019-02-18T03:59:59.999Z'}}).fetch();
    //issues.find({createdAt:{'$gte':'2019-02-18T03:59:59.999Z'}}).fetch();
    let modifiedQuery = JSON.parse(JSON.stringify(sourceQuery));

    //If index exists in query, simply drop it, we only support date condition per field
    if (modifiedQuery[field] !== undefined) {
        delete modifiedQuery[field];
    }

    //Passing date as null will remove it from query
    if (date !== null) {
        if (direction === 'after') {
            modifiedQuery[field] = {'$gt':date}
        } else {
            modifiedQuery[field] = {'$lt':date}
        }
    }
    return modifiedQuery;
};