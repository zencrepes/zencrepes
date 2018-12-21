
export default {
    state: {
        loading: false,         // Boolean to indicate issues are currently loading
        loadFlag: false,        // Boolean to trigger issue load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded

        loadedOrgs: 0,              // Number of orgs loaded
        loadedRepos: 0,             // Number of repositories loaded

        login: null,                // Login of the username currently connected. Used to fetch his/her repos
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setLoadedOrgs(state, payload) {return { ...state, loadedOrgs: payload };},
        setLoadedRepos(state, payload) {return { ...state, loadedRepos: payload };},

        setIncrementLoadedOrgs(state, payload) {return { ...state, loadedOrgs: state.loadedOrgs + payload };},
        setIncrementLoadedRepos(state, payload) {return { ...state, loadedRepos: state.loadedRepos + payload };},

        setLogin(state, payload) {return { ...state, login: payload };},
    },
    effects: {

    }
};