export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading
        loadError: false,       // Is there an error during load

        name: '',               // Org Name
        availableRepos: 0,      // Count of repositories to be loaded
        loadedRepos: 0          // Count of repositories actually loaded
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},

        setName(state, payload) {return { ...state, name: payload };},
        setAvailableRepos(state, payload) {return { ...state, availableRepos: payload };},
        setLoadedRepos(state, payload) {return { ...state, loadedRepos: payload };},

        incrementLoadedRepos(state, payload) {return { ...state, loadedRepos: state.loadedRepos + payload };},
    },
    effects: {

    }
};