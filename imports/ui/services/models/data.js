import _ from 'lodash';

//Add the payload to current filters
import {cfgIssues} from "../../data/Issues";

const addToFilters = (payload, currentFilters) => {
    if (currentFilters[payload.group] === undefined) {currentFilters[payload.group] = [];}
    const currentIndex = currentFilters[payload.group].map((v) => {return v.name}).indexOf(payload.name);
    if (currentIndex === -1) {
        let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
        updatedFilters[payload.group].push(payload);
        return updatedFilters;
    } else {
        return currentFilters;
    }
}
//Remove the payload from current filters
const removeFromFilters = (payload, currentFilters) => {
    if (currentFilters[payload.group] === undefined) {return currentFilters;}
    const currentIndex = currentFilters[payload.group].map((v) => {return v.name}).indexOf(payload.name);
    if (currentIndex === -1) {
        return currentFilters;
    } else {
        let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
        updatedFilters[payload.group].splice(currentIndex, 1);
        return updatedFilters;
    }
};

//Rebuild the data output based on filters
const buildMongoFilter = (filters) => {
    //Build Mongo filter
    console.log('Current Filters: ' + JSON.stringify(filters));
    //{ fruit: { $in: ['peach', 'plum', 'pear'] } }

    //Groups:
    /*
    let mongoFilter = {};
    Object.keys(filters).map(idx => {
        console.log('Group: ' + idx);
        filterValues = [];
        filters[idx].map(value => {
            console.log(value);
            //console.log('Group: ' + idx + ' Value: ' + value.name);
            filterValues.push(value.name);
        })
        if (filters[idx].length > 0) {
            console.log(filterValues);
            console.log(filters[idx][0]);
            if (filters[idx][0].nested === false ) {
                mongoFilter[idx] = { $in : filterValues };
            } else if (filters[idx][0].nullName === filters[idx][0].name) {
                console.log('this is a test');
                mongoFilter[idx + ".totalCount"] = { $eq : 0 };
            } else { // If we are searching in a nest array
                //db.multiArr.find({'Keys':{$elemMatch:{$elemMatch:{$in:['carrot']}}}})
                //{"state":{"$in":["OPEN"]}}
                //window.issues.find({"assignees.edges":{$elemMatch:{"node.login":"USERLOGIN"}}}).fetch();
                //mongoFilter[idx] = {$elemMatch:{$elemMatch:{"name": { $in : filterValues }}}};
                let subFilter = "node." + filters[idx][0].nested;
                mongoFilter[idx + ".edges"] = {};
                mongoFilter[idx + ".edges"]["$elemMatch"] = {};
                mongoFilter[idx + ".edges"]["$elemMatch"][subFilter] = {};
                mongoFilter[idx + ".edges"]["$elemMatch"][subFilter]["$in"] = filterValues;
            }
        }
    });
    */

    let mongoFilter = {};
    // First loop through the object, each index is a facet.
    Object.keys(filters).map(idx => {
        console.log('Building filter for group: ' + idx);
        console.log('Values: ' + JSON.stringify(filters[idx]));

        /*
{
  "repo.name": [
    {
      "count": 135,
      "name": "SONG",
      "group": "repo.name",
      "nested": false
    },
    {
      "count": 190,
      "name": "kf-api-dataservice",
      "group": "repo.name",
      "nested": false
    }
  ],
  "author.login": [
    {
      "count": 61,
      "name": "dankolbman",
      "group": "author.login",
      "nested": false
    }
  ]
}
         */



        filterValues = [];
        filters[idx].map(value => {
            console.log(value);
            //console.log('Group: ' + idx + ' Value: ' + value.name);
            filterValues.push(value.name);
        })
        if (filters[idx].length > 0) {
            console.log(filterValues);
            console.log(filters[idx][0]);
            if (filters[idx][0].nested === false ) {
                mongoFilter[idx] = { $in : filterValues };
            } else if (filters[idx][0].nullName === filters[idx][0].name) {
                console.log('this is a test');
                mongoFilter[idx + ".totalCount"] = { $eq : 0 };
            } else { // If we are searching in a nest array
                //db.multiArr.find({'Keys':{$elemMatch:{$elemMatch:{$in:['carrot']}}}})
                //{"state":{"$in":["OPEN"]}}
                //window.issues.find({"assignees.edges":{$elemMatch:{"node.login":"USERLOGIN"}}}).fetch();
                //mongoFilter[idx] = {$elemMatch:{$elemMatch:{"name": { $in : filterValues }}}};
                let subFilter = "node." + filters[idx][0].nested;
                mongoFilter[idx + ".edges"] = {};
                mongoFilter[idx + ".edges"]["$elemMatch"] = {};
                mongoFilter[idx + ".edges"]["$elemMatch"][subFilter] = {};
                mongoFilter[idx + ".edges"]["$elemMatch"][subFilter]["$in"] = filterValues;
            }
        }
    });



    console.log('Mongo Filter: ' + JSON.stringify(mongoFilter));
    console.log('Number of matched issues: ' + cfgIssues.find(mongoFilter).count());
    return mongoFilter
};

//{ $or: [{"labels.totalCount":{"$eq":0}}, {"labels.edges":{"$elemMatch":{"node.name":{"$in":["bug"]}}}}] }

const clearIssuesFilters = async () => {
//    console.log('clearIssuesFilters - Total issues before: ' + cfgIssues.find({filtered: false}).count());
    await cfgIssues.update({}, { $set: { filtered: false } }, {multi: true});
//    console.log('clearIssuesFilters - Total issues after: ' + cfgIssues.find({filtered: false}).count());
}

const filterMongo = async (mongoFilter) => {
    //Filter Mongo to only return specific data
    await cfgIssues.update({}, { $set: { filtered: true } }, {multi: true});
    await cfgIssues.update(mongoFilter, { $set: { filtered: false } }, {multi: true});
}

const getFacetData = (facet, mongoFilter) => {
//    console.log('getFacetData - Process Facet Group: ' + facet.group);
//    console.log('getFacetData - Mongo Query: ' + JSON.stringify(mongoFilter));

    //Prep Mongo filter
    // If current facet is one of the index of MongoFilter, then no filtering at all.
    // This allow for the creation of the "in" operator
    //if (Object.keys(mongoFilter).indexOf(facet.group) !== -1 && mongoFilter[facet.group]['$in'].length > 0) {
    console.log(facet);
    let indexExist = facet.group
    if (facet.nested !== false ) {
        indexExist = facet.group + ".edges";
    }
    if (Object.keys(mongoFilter).indexOf(indexExist) !== -1 ) {
        // Filter includes some filtering on current facet
        //{ $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
        mongoFilter = {};
    }

    let statesGroup = [];
    if (facet.nested) {
        let allValues = [];
        cfgIssues.find(mongoFilter).forEach((issue) => {
            if (issue[facet.group].totalCount === 0) {
                allValues.push({name: facet.nullName});
            } else {
                issue[facet.group].edges.map((nestedValue) => {
                    if (nestedValue.node[facet.nested] === null || nestedValue.node[facet.nested] === '' || nestedValue.node[facet.nested] === undefined ) {
                        //console.log({...nestedValue.node, name: nestedValue.node.login});
                        allValues.push({...nestedValue.node, name: nestedValue.node.login});
                    } else {
                        allValues.push(nestedValue.node);
                    }
                })
            }
        });
        statesGroup = _.groupBy(allValues, facet.nested);
    } else {
        statesGroup = _.groupBy(cfgIssues.find(mongoFilter).fetch(), facet.group);
        //statesGroup = _.groupBy(cfgIssues.find({ $or: [{filtered: false}, {'repo.name': facet.group}]}).fetch(), facet.group);
    }
    let states = [];
    Object.keys(statesGroup).forEach(function(key) {
        states.push({count: statesGroup[key].length, name: key, group: facet.group, nested: facet.nested, nullName: facet.nullName});
    });
    //Return the array sorted by count
    return states.sort((a, b) => b.count - a.count);
};

export default {
    state: {
        facets: [ // Statically define facets to be displayed
            //header: Header text displayed on the facet
            //group: Minimongo field to group on
            //text: Type of facet
            //nested: Is this going through nested data, if yes, on which idx ?
            //nullName: Name to be displayed if empty or undefined
            //data: Facets data
            {header: 'States', group: 'state', type: 'text', nested: false, data: [] },
            {header: 'Organizations', group: 'org.name', type: 'text', nested: false, data: [] },
            {header: 'Repositories', group: 'repo.name', type: 'text', nested: false, data: [] },
            {header: 'Authors', group: 'author.login', type: 'text', nested: false, data: [] },
            {header: 'Labels', group: 'labels', type: 'textNull', nested: 'name', nullName: 'EMPTY', data: []},
            {header: 'Assignees', group: 'assignees', type: 'text', nested: 'login', data: [] },
            {header: 'Milestones', group: 'milestone.title', type: 'text', nested: false, data: []} ,
            {header: 'Milestones Status', group: 'milestone.state', type: 'text', nested: false, data: [] },
            {header: 'Comments', group: 'comments.totalCount', type: 'text', nested: false, data: [] },
            {header: 'Created Since', group: 'createdSince', type: 'text', nested: false, data: [] },
            {header: 'Last updated Since', group: 'updatedSince', type: 'text', nested: false, data: [] },
            {header: 'Closed Since', group: 'stats.closedSince', type: 'range', nested: false, data: [] },
        ],
        filters: {},
        results: [],
        mongoFilters: null,
        loading: false,
    },
    reducers: {
        clearFilters(state) {return {...state, filters: {}};},
        clearResults(state) {return { ...state, results: []};},
        addFilter(state, payload) {
            return {...state, filters: addToFilters(payload, state.filters)}
        },
        removeFilter(state, payload) {
            return {...state, filters: removeFromFilters(payload, state.filters)}
        },
        updateFacets(state, payload) {
            return { ...state, facets: payload };
        },
        updateResults(state, payload) {
            return { ...state, results: payload };
        },
        updateLoading(state, payload) {
            return { ...state, loading: payload };
        },
        updateMongoFilters(state, payload) {
            return { ...state, mongoFilters: payload };
        }
    },
    effects: {
        //Add a filter, then refresh the data points
        async addFilterRefresh(payload, rootState) {
            //Get the list of updated filters, and push received filter payload to state
            let updatedFilters = addToFilters(payload, rootState.data.filters);
            this.addFilter(payload);

            // Build the mongo filter from the filters state, set the filtered state in the mongo records.
            let mongoFilter = await buildMongoFilter(updatedFilters);
            await filterMongo(mongoFilter);
            this.updateMongoFilters(mongoFilter);

            // Refresh/populate the facets data from mongo
            let newFacets = JSON.parse(JSON.stringify(rootState.data.facets)).map((facet) => {
                return {...facet, data: getFacetData(facet, mongoFilter)};
            });
            await this.updateFacets(newFacets);

            // Update the results
            this.updateResults(cfgIssues.find(mongoFilter).fetch());
        },
        async removeFilterRefresh(payload, rootState) {
            let updatedFilters = removeFromFilters(payload, rootState.data.filters);
            this.removeFilter(payload);

            // Build the mongo filter from the filters state, set the filtered state in the mongo records.
            let mongoFilter = await buildMongoFilter(updatedFilters);
            await filterMongo(mongoFilter);
            this.updateMongoFilters(mongoFilter);

            // Refresh/populate the facets data from mongo
            let newFacets = JSON.parse(JSON.stringify(rootState.data.facets)).map((facet) => {
                return {...facet, data: getFacetData(facet, mongoFilter)};
            });
            await this.updateFacets(newFacets);

            // Update the results
            this.updateResults(cfgIssues.find(mongoFilter).fetch());
        },
        async initFacets(payload, rootState) {
            this.updateLoading(true);

            await clearIssuesFilters();

            // Build the mongo filter from the filters state, set the filtered state in the mongo records.
            let mongoFilter = await buildMongoFilter(rootState.data.filters);

            await filterMongo(mongoFilter);
            this.updateMongoFilters(mongoFilter);

            // Refresh/populate the facets data from mongo
            let newFacets = JSON.parse(JSON.stringify(rootState.data.facets)).map((facet) => {
                return {...facet, data: getFacetData(facet, mongoFilter)};
            });
            await this.updateFacets(newFacets);

            // Update the results
            this.updateResults(cfgIssues.find(mongoFilter).fetch());

            this.updateLoading(false);
        }
    }
};
