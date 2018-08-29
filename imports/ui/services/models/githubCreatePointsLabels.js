export default {
    state: {
        loading: false,         // Boolean to indicate issues are currently loading
        loadFlag: false,        // Boolean to trigger issue load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded
        action: 'create',       // Action to be performed, create or delete

        createdLabels: 0,              // Number of labels created
        updatedRepos: 0,             // Number of repositories updates

    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},
        setAction(state, payload) {return { ...state, action: payload };},

        setCreatedLabels(state, payload) {return { ...state, createdLabels: payload };},
        setUpdatedRepos(state, payload) {return { ...state, updatedRepos: payload };},
        setIncrementCreatedLabels(state, payload) {return { ...state, createdLabels: state.createdLabels + payload };},
        setIncrementUpdatedRepos(state, payload) {return { ...state, updatedRepos: state.updatedRepos + payload };},
    },
    effects: {

    }
};