import _ from 'lodash';


import {cfgIssues} from "../../data/Issues.js";
import {buildMongoSelector} from "../../utils/mongo/index.js";

//Add the payload to current filters
const addToFilters = (payload, currentFilters, currentFacets) => {
    console.log('addToFilters');

    //Look for facet data corresponding to the selected filter
    let facetIdx = _.findIndex(currentFacets, function(v) { return v.group == payload.group; });

    //Initialize the filter with default values
    if (currentFilters[payload.group] === undefined) {
        currentFilters[payload.group] = Object.assign({}, currentFacets[facetIdx]);
        delete currentFilters[payload.group].data;
        if (currentFacets[facetIdx].type === 'text' || currentFacets[facetIdx].type === 'textCount') {
            currentFilters[payload.group].in = [];
            currentFilters[payload.group].nullSelected = false;
        } else if (currentFacets[facetIdx].type === 'range') {
            currentFilters[payload.group].min = 0;
            currentFilters[payload.group].max = 1;
        } else if (currentFacets[facetIdx].type === 'bool') {
            currentFilters[payload.group].bool = null;
        }
    }

    //If current filter is of type text, look for name in the 'in' array
    if (currentFacets[facetIdx].type === 'text' || currentFacets[facetIdx].type === 'textCount') {
        const currentIndex = currentFilters[payload.group].in.indexOf(payload.name);
        if (currentIndex === -1) {
            let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
            updatedFilters[payload.group].in.push(payload.name);
            return updatedFilters;
        }
    }

    else if (currentFacets[facetIdx].type === 'range') {
        if (payload.min !== currentFilters[payload.group].min || payload.max !== currentFilters[payload.group].max) {
            let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
            updatedFilters[payload.group].min = payload.min;
            updatedFilters[payload.group].max = payload.max;
            return updatedFilters;
        }
    }

    else if (currentFacets[facetIdx].type === 'bool') {
        if (payload.bool !== currentFilters[payload.group].bool) {
            let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
            if (payload.bool === null) {
                delete updatedFilters[payload.group];
            } else {
                updatedFilters[payload.group].bool = payload.bool;
            }
            return updatedFilters;
        }
    }

    console.log('addToFilters - No updating filters');
    return currentFilters;

    /*
    if (currentFilters[payload.group] === undefined) {currentFilters[payload.group] = [];}
    const currentIndex = currentFilters[payload.group].map((v) => {return v.name}).indexOf(payload.name);
    if (currentIndex === -1) {
        let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
        updatedFilters[payload.group].push(payload);
        return updatedFilters;
    } else {
        return currentFilters;
    }
    */
};
//Remove the payload from current filters
const removeFromFilters = (payload, currentFilters) => {
    console.log(payload);
    console.log(currentFilters);
    if (currentFilters[payload.group].type === 'text' || currentFilters[payload.group].type === 'textCount') {
        //Search for payload in 'in' array
        const currentIndex = currentFilters[payload.group].in.indexOf(payload.name);
        if (currentIndex !== -1) {
            let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
            updatedFilters[payload.group].in.splice(currentIndex, 1);

            //If array is empty, entirely remove the filter
            if (updatedFilters[payload.group].in.length === 0) {
                delete updatedFilters[payload.group];
            }
            return updatedFilters;
        }
    } else if (currentFilters[payload.group].type === 'range') {
        if (payload.min === null && payload.max === null) { // If either max or min are null, the entire filter is dropped
            let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
            delete updatedFilters[payload.group]
        }
    }
    return currentFilters;
    /*
    if (currentFilters[payload.group] === undefined) {return currentFilters;}
    const currentIndex = currentFilters[payload.group].map((v) => {return v.name}).indexOf(payload.name);
    if (currentIndex === -1) {
        return currentFilters;
    } else {
        let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better to copy object ?
        updatedFilters[payload.group].splice(currentIndex, 1);
        return updatedFilters;
    }
    */
};

const clearIssuesFilters = async () => {
//    console.log('clearIssuesFilters - Total issues before: ' + cfgIssues.find({filtered: false}).count());
    await cfgIssues.update({}, { $set: { filtered: false } }, {multi: true});
//    console.log('clearIssuesFilters - Total issues after: ' + cfgIssues.find({filtered: false}).count());
}

/**
 * filterMongo() Set the filtered state to minimongo
 *
 * Arguments:
 * - mongoFilter: to use for filtered items
 */
const filterMongo = async (mongoFilter) => {
    //Filter Mongo to only return specific data
    await cfgIssues.update({}, { $set: { filtered: true } }, {multi: true});
    await cfgIssues.update(mongoFilter, { $set: { filtered: false } }, {multi: true});
}


/**
 * isFacetSelected() returns true if the facet currently has of its elements selected.
 *
 * Arguments:
 * - facet: Current facet being processed
 * - updatedFilters: List of selected filters
 */
const isFacetSelected = (facet, updatedFilters) => {
    if (updatedFilters[facet.group] === undefined) {
        console.log('return false');
        return false;
    } else {
        console.log('return true');
        return true;
    }
};

/**
 * getFacetAggregations() returns data to be displayed in the facet.
 *   If the facet has one of its element already selected, display all available elements for that facet.
 *
 * Arguments:
 * - facet: Current facet being processed
 * - mongoFilter: Mongo filter used to collect relevant data
 */
const getFacetAggregations = (facet, mongoFilter) => {
    let statesGroup = [];
    if (facet.nested) {
        let allValues = [];
        cfgIssues.find(mongoFilter).forEach((issue) => {
            if (issue[facet.group].totalCount === 0) {
                //console.log('getFacetAggregations - processing: ' + facet.group + ' - Null value: ' + facet.nullName);
                //console.log(allValues);
                let pushObj = {};
                pushObj[facet.nested] = facet.nullName;
                allValues.push(pushObj);
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

    // If the key is 'undefined', replace with default facet name
    if (statesGroup['undefined'] !== undefined) {
        statesGroup[facet.nullName] = statesGroup['undefined'];
        delete statesGroup['undefined'];
    }

    let states = [];
    Object.keys(statesGroup).forEach(function(key) {
        //if (key === null || key === undefined || key === 'undefined' || key === 'null') {facetItemName = facet.nullName;} // If name is undefined or null, replace with its nullValue
        //Check to avoid any duplicate keys
        //if (states.findIndex((v) => { console.log(v.name + " == " + facetItemName);return v.name === facetItemName;}) === -1) {
            states.push({count: statesGroup[key].length, name: key, group: facet.group, nested: facet.nested, type: facet.type, nullName: facet.nullName, nullFilter: facet.nullFilter});
        //}
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
            {header: 'Selected', group: 'pinned', type: 'bool', nested: false, data: [] },
            {header: 'States', group: 'state', type: 'text', nested: false, data: [] },
            {header: 'Organizations', group: 'org.name', type: 'text', nested: false, data: [] },
            {header: 'Repositories', group: 'repo.name', type: 'text', nested: false, data: [] },
            {header: 'Authors', group: 'author.login', type: 'text', nested: false, data: [] },
            {header: 'Labels', group: 'labels', type: 'text', nested: 'name', nullName: 'NO LABEL', nullFilter: {'labels.totalCount': { $eq : 0 }},data: []},
            {header: 'Assignees', group: 'assignees', type: 'text', nested: 'login', nullName: 'UNASSIGNED', nullFilter: {'assignees.totalCount': { $eq : 0 }}, data: [] },
            {header: 'Milestones', group: 'milestone.title', type: 'text', nested: false, nullName: 'NO MILESTONE', nullFilter: {'milestone': { $eq : null }},data: []} ,
            {header: 'Milestones States', group: 'milestone.state', type: 'text', nested: false, data: [] },
            {header: 'Comments', group: 'comments.totalCount', type: 'textCount', nested: false, data: [] },
            {header: 'Days since closing', group: 'stats.closedSince', type: 'range', nested: false, data: [] },
            {header: 'Days since creation', group: 'stats.createdSince', type: 'range', nested: false, data: [] },
            {header: 'Opened For', group: 'stats.openedDuring', type: 'range', nested: false, data: [] },
            {header: 'Days since last update', group: 'stats.updatedSince', type: 'range', nested: false, data: [] },
        ],
        filters: {},
        results: [],
        tableSelection: [],
        mongoFilters: null,
        loading: false,
    },
    reducers: {
        clearFilters(state) {return {...state, filters: {}};},
        clearResults(state) {return { ...state, results: []};},
        addFilter(state, payload) {
            return {...state, filters: addToFilters(payload, state.filters, state.facets)}
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
        updateTableSelection(state, payload) {
            return { ...state, tableSelection: payload };
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
            let updatedFilters = addToFilters(payload, rootState.data.filters, rootState.data.facets);
            this.addFilter(payload);

            // Build the mongo filter from the filters state, set the filtered state in the mongo records.
            let mongoFilter = await buildMongoSelector(updatedFilters);
            await filterMongo(mongoFilter);
            this.updateMongoFilters(mongoFilter);

            // Refresh/populate the facets data from mongo
            let newFacets = JSON.parse(JSON.stringify(rootState.data.facets)).map((facet) => {
                let facetMongoFilter = mongoFilter;
                if (isFacetSelected(facet, updatedFilters) === true && facet.type !== 'bool') {facetMongoFilter = {};} // If the facet is currently selected, do not filter the facet's content
                return {...facet, data: getFacetAggregations(facet, facetMongoFilter)};
            });
            await this.updateFacets(newFacets);

            // Update the results
            let updatedResults = cfgIssues.find(mongoFilter).fetch()
            this.updateResults(updatedResults);

            let selectedIssues = [];
            Object.values(updatedResults).forEach((value,index)=>{
                if (value.pinned === true) {
                    selectedIssues.push(index);
                }
            });
            this.updateTableSelection(selectedIssues);
        },
        async removeFilterRefresh(payload, rootState) {
            let updatedFilters = removeFromFilters(payload, rootState.data.filters);
            this.removeFilter(payload);

            // Build the mongo filter from the filters state, set the filtered state in the mongo records.
            let mongoFilter = await buildMongoSelector(updatedFilters);
            await filterMongo(mongoFilter);
            this.updateMongoFilters(mongoFilter);

            // Refresh/populate the facets data from mongo
            let newFacets = JSON.parse(JSON.stringify(rootState.data.facets)).map((facet) => {
                let facetMongoFilter = mongoFilter;
                if (isFacetSelected(facet, updatedFilters) === true && facet.type !== 'bool') {facetMongoFilter = {};} // If the facet is currently selected, do not filter the facet's content
                return {...facet, data: getFacetAggregations(facet, facetMongoFilter)};
            });
            await this.updateFacets(newFacets);

            // Update the results
            let updatedResults = cfgIssues.find(mongoFilter).fetch()
            this.updateResults(updatedResults);

            let selectedIssues = [];
            Object.values(updatedResults).forEach((value,index)=>{
                if (value.pinned === true) {
                    selectedIssues.push(index);
                }
            });
            this.updateTableSelection(selectedIssues);

        },
        async initFacets(payload, rootState) {
            this.updateLoading(true);

            await clearIssuesFilters();

            // Build the mongo filter from the filters state, set the filtered state in the mongo records.
            let mongoFilter = await buildMongoSelector(rootState.data.filters);

            await filterMongo(mongoFilter);
            this.updateMongoFilters(mongoFilter);

            // Refresh/populate the facets data from mongo
            let newFacets = JSON.parse(JSON.stringify(rootState.data.facets)).map((facet) => {
                return {...facet, data: getFacetAggregations(facet, mongoFilter)};
            });
            await this.updateFacets(newFacets);

            // Update the results
            let updatedResults = cfgIssues.find(mongoFilter).fetch()
            this.updateResults(updatedResults);

            let selectedIssues = [];
            Object.values(updatedResults).forEach((value,index)=>{
                if (value.pinned === true) {
                    selectedIssues.push(index);
                }
            });
            this.updateTableSelection(selectedIssues);

            this.updateLoading(false);
        },
        async updateFromQuery(mongoFilter, rootState, history) {
            console.log(mongoFilter);
            console.log(rootState);
            console.log(history);

            this.updateLoading(true);

            await filterMongo(mongoFilter);
            this.updateMongoFilters(mongoFilter);

            let newFacets = JSON.parse(JSON.stringify(rootState.data.facets)).map((facet) => {
                return {...facet, data: getFacetAggregations(facet, mongoFilter)};
            });
            await this.updateFacets(newFacets);

            // Update the results
            let updatedResults = cfgIssues.find(mongoFilter).fetch()
            this.updateResults(updatedResults);

            let selectedIssues = [];
            Object.values(updatedResults).forEach((value,index)=>{
                if (value.pinned === true) {
                    selectedIssues.push(index);
                }
            });
            this.updateTableSelection(selectedIssues);

            this.updateLoading(false);
            history.push('/search');

        }

    }
};
