
export default {
    state: {
        loadedOrgs: 0,              // Number of orgs loaded
        loadedRepos: 0,             // Number of repositories loaded

        reposLoadingFlag: false,       // Boolean to indicate issues are currently loading
        reposLoadFlag: false,    // Boolean to trigger issue load

    },
    reducers: {
        setReposLoadFlag(state, payload) {
            return { ...state, reposLoadFlag: payload };
        },
        setReposLoadingFlag(state, payload) {
            return { ...state, reposLoadingFlag: payload };
        },
        setLoadedOrgs(state, payload) {
            return { ...state, loadedOrgs: payload };
        },
        setLoadedRepos(state, payload) {
            return { ...state, loadedRepos: payload };
        },
    },
    effects: {

    }
};