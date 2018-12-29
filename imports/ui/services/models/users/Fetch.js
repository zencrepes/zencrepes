export default {
    state: {
        loading: false,         // Boolean to indicate issues are currently loading
        loadFlag: false,        // Boolean to trigger issue load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded
        loadedCount: 0,         // Number of items loaded or updated

        loadUsers: [],          // Array of users login
    },
    reducers: {
        setLoadFlag(state, loadFlag) {
            // Only allow load to start if loading is not already currently happening
            if (loadFlag === true && state.loading === false) {
                return { ...state, loadFlag: true, loadedCount: 0, loading: true, loadSuccess: false};
            } else {
                return { ...state, loadFlag: false };
            }
        },
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setLoadUsers(state, payload) {return { ...state, loadUsers: payload };},

        setLoadedCount(state, payload) {return { ...state, loadedCount: payload };},
        incLoadedCount(state, payload) {return { ...state, loadedCount: state.loadedCount + payload };},
    },
    effects: {

    }
};
