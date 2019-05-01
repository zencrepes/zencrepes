import _ from 'lodash';
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

/*
*
* addFilterOutFromQuery() Filter out a particular label from a query.
* This is a partial implementation supporting only ANY OF and NOT logic
* For now going with simplistic logic even if duplicate code.
*
* Arguments:
* - sourceQuery: Actual query to be updated
* - label: label to take an action on
*/
export const addRemoveFilterOutFromQuery = (sourceQuery, label, action) => {
    let modifiedQuery = JSON.parse(JSON.stringify(sourceQuery));

    /*
        issues.find({"projectCards.edges":{"$elemMatch":{"node.project.name":{"$in":["Project: ABCD"]}}},$and: [
            {
              "labels.edges": {
                "$elemMatch": {
                  "node.name": {
                    "$in": [
                      "sprint:2"
                    ]
                  }
                }
              }
            },
            {
              "labels.edges": {
                $not: {
                  "$elemMatch": {
                    "node.name": {
                      "$in": [
                        "loe:medium"
                      ]
                    }
                  }
                }
              }
            }
          ]}).fetch();
     */

    //Possible states:
    // A- No label filter at all
    // B- Inclusive label filter ONLY (for example a sprint selected)
    // C- Inclusive label filter AND excluding label filter
    // D- Excluding label filter ONLY

    //Detect if there is currently an and filter in place on the labels field
    const notFilter = _.get(modifiedQuery, ['labels.edges', '$not', '$elemMatch', 'node.name', '$in'], []);
    //const andNotFilter = _.get(modifiedQuery, ['$and', 'labels.edges', '$not', '$elemMatch', 'node.name', '$in'], []);
    let andNotFilter = [];
    if (sourceQuery['$and'] !== undefined) {
        sourceQuery['$and'].forEach((k) => {
            if (k['labels.edges'] !== undefined && k['labels.edges']['$not'] !== undefined) {
                andNotFilter = _.get(k, ['labels.edges', '$not', '$elemMatch', 'node.name', '$in'], []);
            }
        })
    }
    const inFilter = _.get(modifiedQuery, ['labels.edges', '$elemMatch', 'node.name', '$in'], []);
    //const andInFilter = _.get(modifiedQuery, ['$and', 'labels.edges', '$elemMatch', 'node.name', '$in'], []);
    let andInFilter = [];
    if (sourceQuery['$and'] !== undefined) {
        sourceQuery['$and'].forEach((k) => {
            if (k['labels.edges'] !== undefined && k['labels.edges']['$elemMatch'] !== undefined) {
                andInFilter = _.get(k, ['labels.edges', '$elemMatch', 'node.name', '$in'], []);
            }
        })
    }
    /*
    console.log(notFilter);
    console.log(andNotFilter);
    console.log(inFilter);
    console.log(andInFilter);
    */

    if (action === 'add' && inFilter.length === 0 && andNotFilter.length === 0 && andInFilter.length === 0) {
        // Use cases matching this condition:
        // -> User excludes a filter for the first time when no sprints are selected
        // -> User excludes another filter when no sprints are selected
        //console.log('Condition 1');
        const labels = notFilter;
        labels.push(label.name);

        modifiedQuery = {
            ...modifiedQuery,
            'labels.edges': {
                $not: {
                    $elemMatch: {
                        'node.name': {
                            $in: labels
                        }
                    }
                }
            }
        }
    } else if (action === 'remove' && notFilter.length > 0 && inFilter.length === 0 && andNotFilter.length === 0 && andInFilter.length === 0 ) {
        // Use cases matching this condition:
        // -> User removes one or more exclude filter when no sprints are selected
        //console.log('Condition 2');
        const labels = notFilter.filter(l => l !== label.name);
        //console.log(labels);
        if (labels.length === 0) {
            if (modifiedQuery['labels.edges'] !== undefined) {
                delete modifiedQuery['labels.edges'];
            }
        } else {
            modifiedQuery = {
                ...modifiedQuery,
                'labels.edges': {
                    $not: {
                        $elemMatch: {
                            'node.name': {
                                $in: labels
                            }
                        }
                    }
                }
            }
        }
    } else if (action === 'add' && notFilter.length === 0 && (inFilter.length > 0 || andInFilter.length > 0) ) {
        // Use cases matching this condition:
        // -> A sprint or phase is selected AND:
        // ----> User adds one or more exclude filters
        // This condition actually also enables the $and logic if needed
        //console.log('Condition 3');
        const labels = andNotFilter;
        labels.push(label.name);

        modifiedQuery = {
            ...modifiedQuery,
            $and: [
                {
                    "labels.edges": {
                        $elemMatch: {
                            "node.name": {
                                $in: [...inFilter, ...andInFilter]
                            }
                        }
                    }
                }, {
                    "labels.edges": {
                        $not: {
                            $elemMatch: {
                                "node.name": {
                                    $in: labels
                                }
                            }
                        }
                    }
                }
            ]
        };
        if (modifiedQuery['labels.edges'] !== undefined) {
            delete modifiedQuery['labels.edges'];
        }
    } else if (action === 'remove' && notFilter.length === 0 && inFilter.length === 0 && andNotFilter.length > 0 && andInFilter.length > 0 ) {
        // Use cases matching this condition:
        // -> A sprint or phase is selected AND:
        // ----> User removes one or more exclude filters
        // This condition actually also removes the $and logic if needed
        //console.log('Condition 4');
        const labels = andNotFilter.filter(l => l !== label.name);
        modifiedQuery = {
            ...modifiedQuery,
            $and: [
                {
                    "labels.edges": {
                        $elemMatch: {
                            "node.name": {
                                $in: andInFilter
                            }
                        }
                    }
                }, {
                    "labels.edges": {
                        $not: {
                            $elemMatch: {
                                "node.name": {
                                    $in: labels
                                }
                            }
                        }
                    }
                }
            ]
        };
        if (labels.length === 0) {
            delete modifiedQuery['$and'];
            modifiedQuery = {
                ...modifiedQuery,
                'labels.edges': {
                    $elemMatch: {
                        'node.name': {
                            $in: andInFilter
                        }
                    }
                }
            }
        }
    }


    return modifiedQuery;
};