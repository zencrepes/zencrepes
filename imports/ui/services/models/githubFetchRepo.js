export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading
        loadError: false,       // Is there an error during load

        orgName: '',            // Org Name
        repoName: '',           // Repo Name
        repoData: {}            // Repository data
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},

        setOrgName(state, payload) {return { ...state, orgName: payload };},
        setRepoName(state, payload) {return { ...state, repoName: payload };},
        setRepoData(state, payload) {return { ...state, repoData: payload };},
    },
    effects: {

    }
};