import {cfgMilestones} from "../../../data/Minimongo";

export default {
    state: {
        loading: false,         // Boolean to indicate issues are currently loading
        loadFlag: false,        // Boolean to trigger issue load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded
        loadedCount: 0,         // Number of items loaded or updated

        loadRepos: [],

        iterateTotal: 0,        // To show progress, total number of iterations
        iterateCurrent: 0,      // To show progress, current iterations status
    },
    reducers: {
        setLoadFlag(state, loadFlag) {
            // Only allow load to start if loading is not already currently happening
            if (loadFlag === true && state.loading === false) {
                return { ...state, loadFlag: true, iterateCurrent: 0, loadedCount: 0, loading: true};
            } else {
                return { ...state, loadFlag: false };
            }
        },
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setLoadRepos(state, payload) {return { ...state, loadRepos: payload };},

        setLoadedCount(state, payload) {return { ...state, loadedCount: payload };},
        incLoadedCount(state, payload) {return { ...state, loadedCount: state.loadedCount + payload };},

        setIterateTotal(state, payload) {return { ...state, iterateTotal: payload };},
        setIterateCurrent(state, payload) {return { ...state, iterateCurrent: payload };},
        incIterateCurrent(state, payload) {return { ...state, iterateCurrent: state.iterateCurrent + payload };},
    },
    effects: {
    }
};
