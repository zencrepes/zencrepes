/*
 *
 * buildMongoFilter() Build a mongo selector based on a filter object
 *
 * Arguments:
 * - filter: Filter object
 */
export const buildMongoSelector = (filters) => {
//    console.log('Current Filters: ' + JSON.stringify(filters));
    /*
     TEST DATA
     let filters = {
     "repo.name": [
     {"count": 135, "name": "SONG", "group": "repo.name","nested": false,"nullName":"EMPTY"},
     {"count": 190,"name": "kf-api-dataservice","group": "repo.name","nested": false,"nullName":"EMPTY"},
     {"count": 190,"name": "EMPTY","group": "repo.name","nested": false,"nullName":"EMPTY"}
     ],
     "author.login": [
     {"count": 61, "name": "dankolbman", "group": "author.login","nested": false}
     ],
     "labels": [
     {"count":948,"name":"EMPTY","group":"labels","nested":"name","nullName":"EMPTY"},
     {"count":159,"name":"bug","group":"labels","nested":"name","nullName":"EMPTY"}
     ]
     };

     Codepen: https://codepen.io/anon/pen/dKyOXo?editors=0010
     */
    let mongoFilter = Object.keys(filters).map(idx => {
        //console.log('Building filter for group: ' + idx);
        //console.log('Values: ' + JSON.stringify(filters[idx]));

        let currentQuery = {};
        // If filter type if text
        let currentFilter = filters[idx];
        if (currentFilter.type === 'text' || currentFilter.type === 'textCount') {
            //Only do something if there is content to be filtered on.
            if (currentFilter.in.length > 0) {
                let filteredValues = filters[idx].in;
                //If the facet is of type textCount, convert all values to numbers.
                if (currentFilter.type  === 'textCount') {filteredValues = currentFilter.in.map(v => parseInt(v));}

                if (filters[idx].nested === false ) {
                    currentQuery[idx] = { $in : filteredValues.filter(val => val !== currentFilter.nullName) }; // Filter out nullName value
                    // Test if array of values contains a "nullName" (name taken by undefined or non-existing field);
                    if (filteredValues.includes(currentFilter.nullName)) {
                        if (filteredValues.length === 1) { //This means there is only 1 filtered item, and it has to be the null one
                            return currentFilter.nullFilter;
                        } else {
                            return {$or :[currentFilter.nullFilter,currentQuery]}; // Wrapping the regular filters in an OR condition with the nullName value
                        }
                    }
                } else {
                    let subFilter = "node." + filters[idx].nested;
                    currentQuery[idx + ".edges"] = {$elemMatch: {}};
                    currentQuery[idx + ".edges"]["$elemMatch"][subFilter] = {};
                    currentQuery[idx + ".edges"]["$elemMatch"][subFilter]["$in"] = filteredValues.filter(val => val !== currentFilter.nullName);
                    // Test if array of values contains a "nullName" (name taken by undefined or non-existing field);
                    if (filteredValues.includes(currentFilter.nullName)) {
                        //console.log('The array contains an empty value');
                        if (filteredValues.length === 1) { //This means there is only 1 filtered item, and it has to be the null one
                            return currentFilter.nullFilter;
                        } else {
                            // If it contains an empty value, it becomes necessary to add an "or" statement
                            //{ $or: [{"labels.totalCount":{"$eq":0}}, {"labels.edges":{"$elemMatch":{"node.name":{"$in":["bug"]}}}}] }
                            //let masterFilter = {$or :[currentFilter, filters[idx][0].nullFilter]};
                            // masterFilter["$or"][1][idx + ".totalCount"] = { $eq : 0 };
                            return {$or :[currentQuery, currentFilter.nullFilter]};
                        }
                    }
                }
            }
        } else if (currentFilter.type === 'range') {
            let gte = {};
            gte[idx] = {$gte:currentFilter.min};
            let lte = {};
            lte[idx] = {$lte:currentFilter.max};
            currentQuery = {$and:[gte, lte]};
        } else if (currentFilter.type === 'bool') {
            currentQuery[idx]= { $eq : currentFilter.bool };
        }
        return currentQuery;
    });

//    console.log('Mongo Filter: ' + JSON.stringify(mongoFilter));

    // Convert array of objects to an object that can be parsed by Mongo
    /*
     Example 1:
     From: [{"state":{"$in":["OPEN"]}}]
     To: {"state":{"$in":["OPEN"]}}

     Example 2:
     From: [{"org.name":{"$in":["Overture"]}},{"state":{"$in":["OPEN"]}}]
     To: [{"org.name":{"$in":["Overture"]}},{"state":{"$in":["OPEN"]}}]

     Example 3:
     From: [{"org.name":{"$in":["Overture","ICGC DCC"]}},{"state":{"$in":["OPEN"]}}]
     To: {"org.name":{"$in":["Overture","ICGC DCC"]},"state":{"$in":["OPEN"]}}

     Example 4:
     From: [null]
     To: {}
     */

    // Strip all null values (example 4)
    mongoFilter = mongoFilter.filter(v => v !== undefined);

    if (mongoFilter.length === 0) {
        mongoFilter = {};
    } else  {
        let convertedMongoFilter = {};
        mongoFilter.forEach(value => {
            let idx = Object.keys(value)[0];
            convertedMongoFilter[idx] = value[idx];
        });
        mongoFilter = convertedMongoFilter;
    }

//    console.log('Mongo Filter: ' + JSON.stringify(mongoFilter));
    return mongoFilter

};