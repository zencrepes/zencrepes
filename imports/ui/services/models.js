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

export const github = {
    state: {
        totalOrgs: 0,
        totalRepos: 0,
        totalIssues: 0,
        totalLoading: false,
    },
    reducers: {
        incrementTotalOrgs(state, payload) {
            return { ...state, totalOrgs: state.totalOrgs + payload };
        },
        incrementTotalRepos(state, payload) {
            return { ...state, totalRepos: state.totalRepos + payload };
        },
        incrementTotalIssues(state, payload) {
            return { ...state, totalIssues: state.totalIssues + payload };
        },
        updateTotalLoading(state, payload) {
            return { ...state, totalLoading: payload };
        },
    }
};