export default {
    state: {
        loadFlag: false,        // Boolean to trigger labels load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded
        loadedCount: 0,         // Number of items loaded or updated

        loadRepos: [],          // Array of repos id

        iterateTotal: 0,        // To show progress, total number of iterations
        iterateCurrent: 0,      // To show progress, current iterations status
        onSuccess: () => {}     // Function to be triggered on success
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setLoadRepos(state, payload) {return { ...state, loadRepos: payload };},

        setLoadedCount(state, payload) {return { ...state, loadedCount: payload };},
        incLoadedCount(state, payload) {return { ...state, loadedCount: state.loadedCount + payload };},

        setIterateTotal(state, payload) {return { ...state, iterateTotal: payload };},
        setIterateCurrent(state, payload) {return { ...state, iterateCurrent: payload };},
        incIterateCurrent(state, payload) {return { ...state, iterateCurrent: state.iterateCurrent + payload };},
        setOnSuccess(state, payload) {return { ...state, onSuccess: payload };},
    },
    effects: {

    }
};
