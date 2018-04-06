// count model
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
        },
        updateLimit(state, limit){
            return {
                ...state,
                ['limit']: limit
            }
        },
        addBy(state, payload) {
            return state + payload
        }
    },
    effects: {
        async addByAsync(payload, state) {
            await delay(1000)
            this.addBy(1)
        }
    }
};

