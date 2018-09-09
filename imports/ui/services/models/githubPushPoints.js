export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded

        message: '',               // Message to be displayed during load

        updatedIssues: 0
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setMessage(state, payload) {return { ...state, message: payload };},

        setUpdatedIssues(state, payload) {return { ...state, updatedIssues: payload };},
        setIncrementUpdatedIssues(state, payload) {return { ...state, updatedIssues: state.updatedIssues + payload };},
    },
    effects: {

    }
};