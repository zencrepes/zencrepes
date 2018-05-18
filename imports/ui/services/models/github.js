
export default {
    state: {
        totalOrgs: 0,
        totalRepos: 0,
        totalIssues: 0,
        selectedOrgs: 0,
        selectedRepos: 0,
        selectedIssues: 0,
        loadedOrgs: 0,
        loadedRepos: 0,
        loadedIssues: 0,

        unfilteredIssues: 0,
        totalLoading: false,
        issuesLoading: false, // Boolean to indicate issues are currently loading
        loadIssues: false,
    },
    reducers: {
        //Total are the overall items available to a user
        setTotalRepos(state, payload) {
            return { ...state, totalRepos: payload };
        },
        setTotalIssues(state, payload) {
            return { ...state, totalIssues: payload };
        },
        setTotalOrgs(state, payload) {
            return { ...state, totalOrgs: payload };
        },

        //Selected are the total items selected by a user for load
        setSelectedOrgs(state, payload) {
            return { ...state, selectedOrgs: payload };
        },
        setSelectedRepos(state, payload) {
            return { ...state, selectedRepos: payload };
        },
        setSelectedIssues(state, payload) {
            return { ...state, selectedIssues: payload };
        },

        //Loaded are the total items actually loaded from GitHub
        setLoadedOrgs(state, payload) {
            return { ...state, loadedOrgs: payload };
        },
        setLoadedRepos(state, payload) {
            return { ...state, loadedRepos: payload };
        },
        setLoadedIssues(state, payload) {
            return { ...state, loadedIssues: payload };
        },

        incrementTotalOrgs(state, payload) {
            return { ...state, totalOrgs: state.totalOrgs + payload };
        },
        incrementTotalRepos(state, payload) {
            return { ...state, totalRepos: state.totalRepos + payload };
        },
        incrementTotalIssues(state, payload) {
            return { ...state, totalIssues: state.totalIssues + payload };
        },
        incrementUnfilteredIssues(state, payload) {
            return { ...state, totalIssues: state.unfilteredIssues + payload };
        },
        updateTotalLoading(state, payload) {
            return { ...state, totalLoading: payload };
        },
        updateIssuesLoading(state, payload) {
            return { ...state, issuesLoading: payload };
        },
        setLoadIssues(state, payload) {
            return { ...state, loadIssues: payload };
        },
        setIssuesLoading(state, payload) {
            return { ...state, issuesLoading: payload };
        },
    },
    effects: {
        //Add a filter, then refresh the data points
        abc() {
            return 'abc';
        }
    }
};