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
    },
    reducers: {
        incrementTotalOrgs(state, payload) {
            state.totalOrgs = state.totalOrgs + payload;
            return state
        },
        incrementTotalRepos(state, payload) {
            state.totalRepos = state.totalRepos + payload;
            return state
        },
        incrementTotalIssues(state, payload) {
            state.totalIssues = state.totalIssues + payload;
            return state
        },

    }
};
