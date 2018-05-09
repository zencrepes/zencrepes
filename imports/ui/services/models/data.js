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
    let mongoFilter = {};
    Object.keys(filters).map(idx => {
        //console.log('Group: ' + idx);
        filterValues = [];
        filters[idx].map(value => {
            //console.log('Group: ' + idx + ' Value: ' + value.name);
            filterValues.push(value.name);
        })
        if (filters[idx].length > 0) {
            mongoFilter[idx] = { $in : filterValues };
        }
    })
//    console.log('Mongo Filter: ' + JSON.stringify(mongoFilter));
//    console.log('Number of matched issues: ' + cfgIssues.find(mongoFilter).count());
    return mongoFilter
};

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
    if (Object.keys(mongoFilter).indexOf(facet.group) !== -1 && mongoFilter[facet.group]['$in'].length > 0) {
        // Filter includes some filtering on current facet
        //{ $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
        mongoFilter = {};
    }

    let statesGroup = [];
    if (facet.nested) {
        let allValues = [];
        cfgIssues.find(mongoFilter).forEach((issue) => {
            if (issue[facet.group].totalCount === 0) {
                allValues.push({name: 'EMPTY'});
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
        states.push({count: statesGroup[key].length, name: key, group: facet.group, nested: facet.nested});
    });
    //Return the array sorted by count
    return states.sort((a, b) => b.count - a.count);
};

export default {
    state: {
        facets: [ // Statically define facets to be displayed
            {header: 'States', group: 'state', nested: false, data: [] },
            {header: 'Organizations', group: 'org.name', nested: false, data: [] },
            {header: 'Repositories', group: 'repo.name', nested: false, data: [] },
            {header: 'Authors', group: 'author.login', nested: false, data: [] },
            {header: 'Labels', group: 'labels', nested: 'name', data: [] },
            {header: 'Assignees', group: 'assignees', nested: 'name', data: [] },
            {header: 'Milestones', group: 'milestone.title', nested: false, data: []} ,
            {header: 'Milestones Status', group: 'milestone.state', nested: false, data: [] },
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
