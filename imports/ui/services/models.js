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
        let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better ?
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
        let updatedFilters = JSON.parse(JSON.stringify(currentFilters)); //TODO - Replace this with something better ?
        updatedFilters[payload.group].splice(currentIndex, 1);
        return updatedFilters;
    }
}

//Rebuild the data output based on filters
const updateFromFilters = (filters) => {
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

//        mongoFilter = { idx : { $in : filterValues }};
    })
    console.log(JSON.stringify(mongoFilter));
    return cfgIssues.find(mongoFilter).fetch();
}


export const filters = {
    state: {
        filters: {},
        results: [],
    },
    reducers: {
        addFilter(state, payload) {
            console.log('Add Filter');
            return {...state, filters: addToFilters(payload, state.filters)}
        },
        removeFilter(state, payload) {
            console.log('Remove Filter');
            return {...state, filters: removeFromFilters(payload, state.filters)}
        },
        updateResults(state, payload) {
            return { ...state, results: payload };
        }
    },
    effects: {
        //Add a filter, then refresh the data points
        async addFilterRefresh(payload, rootState) {
            let updatedFilters = addToFilters(payload, rootState.filters.filters);
            this.addFilter(payload);
            let updatedData = await updateFromFilters(updatedFilters);
            this.updateResults(updatedData);

        },
        async removeFilterRefresh(payload, rootState) {
            let updatedFilters = removeFromFilters(payload, rootState.filters.filters);
            this.removeFilter(payload);
            let updatedData = await updateFromFilters(updatedFilters);
            this.updateResults(updatedData);
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