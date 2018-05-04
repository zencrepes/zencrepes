import _ from 'lodash';
import { dispatch } from '@rematch/core'

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

export const filters = {
    state: {
        filters: {},
        results: 0,
    },
    reducers: {
        addFilter(state, payload) {
            console.log('Add Filter');
            const { group } = payload;
            //Lookup payload in current state group
            let currentValues = Object.assign({}, state.filters);
            if (state.filters[group] === undefined) {currentValues[group] = [];}
            const currentIndex = currentValues[group].map((v) => {return v.name}).indexOf(payload.name);
            if (currentIndex === -1) {
                currentValues[group].push(payload);
                return { ...state, filters: currentValues };
            } else {
                return state;
            }
        },
        removeFilter(state, payload) {
            const { group } = payload;
            let currentValues = Object.assign({}, state.filters);
            if (state.filters[group] === undefined) {return state;}
            const currentIndex = currentValues[group].map((v) => {return v.name}).indexOf(payload.name);
            if (currentIndex === -1) {
                return state;
            } else {
                currentValues[group].splice(currentIndex, 1);
                return { ...state, filters: currentValues };
            }
        },
        updateResults(state, payload) {
            return { ...state, results: payload };
        }
    },
    effects: {
        async addFilterEffect(payload, rootState) {
            console.log(rootState);
            console.log(rootState.filters.filters);
            let newState = await this.addFilter(payload);
            console.log('Updated State');
            console.log(rootState);
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