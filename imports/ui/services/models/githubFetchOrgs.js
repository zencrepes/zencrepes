
export default {
    state: {
        loading: false,    // Boolean to indicate issues are currently loading
        loadFlag: false,       // Boolean to trigger issue load

        loadedOrgs: 0,              // Number of orgs loaded
        loadedRepos: 0,             // Number of repositories loaded
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoading(state, payload) {return { ...state, loading: payload };},

        setLoadedOrgs(state, payload) {return { ...state, loadedOrgs: payload };},
        setLoadedRepos(state, payload) {return { ...state, loadedRepos: payload };},

        setIncrementLoadedOrgs(state, payload) {return { ...state, loadedOrgs: state.loadedOrgs + payload };},
        setIncrementLoadedRepos(state, payload) {return { ...state, loadedRepos: state.loadedRepos + payload };},
    },
    effects: {

    }
};