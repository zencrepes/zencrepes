export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading
        loadSuccess: false,         // Data is currently loading

    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

    },
    effects: {

    }
};