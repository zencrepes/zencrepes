export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading
        loadSuccess: false,     // Data is currently loading

        loadRepos: []           // Restrice load to only a subset of repositories
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setLoadRepos(state, payload) {return { ...state, loadRepos: payload };},
    },
    effects: {

    }
};