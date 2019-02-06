export default {
    state: {
        loadFlag: false,        // Boolean to trigger labels load
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
    },
    effects: {

    }
};