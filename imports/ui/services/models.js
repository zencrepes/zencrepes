import _ from 'lodash';
import { dispatch } from '@rematch/core';

import { cfgIssues } from '../data/Issues.js';


// https://rematch.gitbooks.io/rematch/#examples
export const chip = {
    state: {
        limit: 5000,
        cost: 1,
        remaining: 5000,
        resetAt: null,
    },
    reducers: {
        updateChip(state, newChip) {
            if (newChip === undefined) {
                newChip = state;
            }
            return newChip;
        }
    }
};

//Add the payload to current filters
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
    console.log('Current Filters');
    console.log(filters);

    //{ fruit: { $in: ['peach', 'plum', 'pear'] } }

    //Groups:
    let mongoFilter = {};
    Object.keys(filters).map(idx => {
        console.log('Group: ' + idx);
        filterValues = [];
        filters[idx].map(value => {
            console.log('Group: ' + idx + ' Value: ' + value.name);
            filterValues.push(value.name);
        })
        if (filters[idx].length > 0) {
            mongoFilter[idx] = { $in : filterValues };
        }
    })
    console.log('Mongo Filter: ' + JSON.stringify(mongoFilter));
    console.log('Number of matched issues: ' + cfgIssues.find(mongoFilter).count());
    return mongoFilter
};

const filterMongo = async (mongoFilter) => {
    //Filter Mongo to only return specific data
    await cfgIssues.update({}, { $set: { filtered: true } }, {multi: true});
    await cfgIssues.update(mongoFilter, { $set: { filtered: false } }, {multi: true});
}
/*
db.collection.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>,
     collation: <document>,
     arrayFilters: [ <filterdocument1>, ... ]
   }
)

 */

const getFacetData = (facet) => {
    console.log('getFacetData - Process Facet Group: ' + facet.group);
    let statesGroup = [];
    if (facet.nested) {
        let allValues = [];
        cfgIssues.find({filtered: false}).forEach((issue) => {
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
        statesGroup = _.groupBy(cfgIssues.find({}).fetch(), facet.group);
    }
    let states = [];
    Object.keys(statesGroup).forEach(function(key) {
        states.push({count: statesGroup[key].length, name: key, group: facet.group, nested: facet.nested});
    });
    //Return the array sorted by count
    return states.sort((a, b) => b.count - a.count);
};

/*
const getFacetStatesData = (group, nested) => {
    let statesGroup = []
    if (nested) {
        let allValues = [];
        cfgIssues.find({}).forEach((issue) => {
            if (issue[group].totalCount === 0) {
                allValues.push({name: 'EMPTY'});
            } else {
                issue[group].edges.map((nestedValue) => {
                    if (nestedValue.node[nested] === null || nestedValue.node[nested] === '' || nestedValue.node[nested] === undefined ) {
                        //console.log({...nestedValue.node, name: nestedValue.node.login});
                        allValues.push({...nestedValue.node, name: nestedValue.node.login});
                    } else {
                        allValues.push(nestedValue.node);
                    }
                })
            }
        })
        statesGroup = _.groupBy(allValues, nested);
    } else {
        statesGroup = _.groupBy(cfgIssues.find({}).fetch(), group);
    }
    let states = [];
    //console.log(statesGroup);
    Object.keys(statesGroup).forEach(function(key) {
        states.push({count: statesGroup[key].length, name: key, group: group, nested: nested});
    });
    //console.log(states);
    //Return the array sorted by count
    return states.sort((a, b) => b.count - a.count);
}
*/

export const data = {
    state: {
        facets: [ // Statically define facets to be displayed
            {header: 'States', group: 'state', nested: false, data: [] },
            {header: 'Organizations', group: 'org.name', nested: false, data: [] },
            {header: 'Repositories', group: 'repo.name', nested: false, data: [] },
            {header: 'Authors', group: 'author.name', nested: false, data: [] },
            {header: 'Labels', group: 'labels', nested: 'name', data: [] },
            {header: 'Assignees', group: 'assignees', nested: 'name', data: [] },
            {header: 'Milestones', group: 'milestone.title', nested: false, data: []} ,
            {header: 'Milestones Status', group: 'milestone.state', nested: false, data: [] },
        ],
        filters: {},
        results: [],
        loading: false,
    },
    reducers: {
        clearFilters(state) {return {...state, filters: {}};},
        clearResults(state) {return { ...state, results: []};},
        addFilter(state, payload) {
            console.log('Add Filter');
            return {...state, filters: addToFilters(payload, state.filters)}
        },
        removeFilter(state, payload) {
            console.log('Remove Filter');
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
        }
    },
    effects: {
        //Add a filter, then refresh the data points
        async addFilterRefresh(payload, rootState) {
            let updatedFilters = addToFilters(payload, rootState.data.filters);
            this.addFilter(payload);

            let facets = JSON.parse(JSON.stringify(rootState.data.facets));
            facets.map((facet) => {
                let facetData = getFacetData(facet);
                facet.data = facetData;
                return facet;
            });
            await this.updateFacets(facets);

            let mongoFilter = await buildMongoFilter(updatedFilters);
            await filterMongo(mongoFilter);
            this.updateResults(cfgIssues.find(mongoFilter).fetch());
        },
        async removeFilterRefresh(payload, rootState) {
            let updatedFilters = removeFromFilters(payload, rootState.data.filters);
            this.removeFilter(payload);

            let facets = JSON.parse(JSON.stringify(rootState.data.facets));
            facets.map((facet) => {
                let facetData = getFacetData(facet);
                facet.data = facetData;
                return facet;
            });
            await this.updateFacets(facets);

            let mongoFilter = await buildMongoFilter(updatedFilters);
            await filterMongo(mongoFilter);
            this.updateResults(cfgIssues.find(mongoFilter).fetch());
        },
        async initFacets(payload, rootState) {
            console.log('initFacets');
            this.updateLoading(true);
            let facets = JSON.parse(JSON.stringify(rootState.data.facets));
            facets.map((facet) => {
                let facetData = getFacetData(facet);
                facet.data = facetData;
                return facet;
            });
            let updatedFacets = await this.updateFacets(facets);
            let mongoFilter = await buildMongoFilter(rootState.data.filters);
            await filterMongo(mongoFilter);
            this.updateResults(cfgIssues.find(mongoFilter).fetch());
            this.updateLoading(false);
        }
    }
};

export const github = {
    state: {
        totalOrgs: 0,
        totalRepos: 0,
        totalIssues: 0,
        unfilteredIssues: 0,
        totalLoading: false,
        issuesLoading: false,
        loadIssues: false,
    },
    reducers: {
        setTotalRepos(state, payload) {
            return { ...state, totalRepos: payload };
        },
        setTotalIssues(state, payload) {
            return { ...state, totalIssues: payload };
        },
        setTotalOrgs(state, payload) {
            return { ...state, totalOrgs: payload };
        },
        incrementTotalOrgs(state, payload) {
            return { ...state, totalOrgs: state.totalOrgs + payload };
        },
        incrementTotalRepos(state, payload) {
            return { ...state, totalRepos: state.totalRepos + payload };
        },
        incrementTotalIssues(state, payload) {
            return { ...state, totalIssues: state.totalIssues + payload };
        },
        incrementUnfilteredIssues(state, payload) {
            return { ...state, totalIssues: state.unfilteredIssues + payload };
        },
        updateTotalLoading(state, payload) {
            return { ...state, totalLoading: payload };
        },
        updateIssuesLoading(state, payload) {
            return { ...state, issuesLoading: payload };
        },
        setLoadIssues(state, payload) {
            return { ...state, loadIssues: payload };
        },
    }
};