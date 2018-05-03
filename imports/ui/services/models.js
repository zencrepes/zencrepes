import _ from 'lodash';

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

export const query = {
    state: {
        values: {},
        results: 0,
    },
    reducers: {
        addToQuery(state, payload) {
            const { group } = payload;
            //Lookup payload in current state group
            let currentValues = Object.assign({}, state.values);
            if (state.values[group] === undefined) {currentValues[group] = [];}
            const currentIndex = currentValues[group].map((v) => {return v.name}).indexOf(payload.name);
            if (currentIndex === -1) {
                currentValues[group].push(payload);
                return { ...state, values: currentValues };
            } else {
                return state;
            }
        },
        removeFromQuery(state, payload) {
            const { group } = payload;
            let currentValues = Object.assign({}, state.values);
            if (state.values[group] === undefined) {return state;}
            const currentIndex = currentValues[group].map((v) => {return v.name}).indexOf(payload.name);
            if (currentIndex === -1) {
                return state;
            } else {
                currentValues[group].splice(currentIndex, 1);
                return { ...state, values: currentValues };
            }
        },
        updateResults(state, payload) {
            return { ...state, results: payload };
        },
        updateQuery(state, payload) {
            return { ...state, values: payload };
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