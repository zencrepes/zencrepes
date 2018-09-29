export default {
    state: {
        loading: false,         // Boolean to indicate issues are currently loading
        loadFlag: false,        // Boolean to trigger issue load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded
        action: 'create',       // Action to be performed, create or delete

        repos: [],
        name: '',
        endDate: '',
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},
        setAction(state, payload) {return { ...state, action: payload };},

        setRepos(state, payload) {return { ...state, repos: payload };},
        setName(state, payload) {return { ...state, repos: payload };},
        setEndDate(state, payload) {return { ...state, repos: payload };},
    },
    effects: {

    }
};