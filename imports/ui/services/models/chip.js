// https://rematch.gitbooks.io/rematch/#examples
export default {
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
        },
        setRemaining(state, payload) {return { ...state, remaining: payload };},

    }
};
