export default {
    state: {
        loadedIssues: false,
        loadedSources: false,
        loadedLabels: false,
        loadedQueries: false,
    },
    reducers: {
        setLoadedIssues(state, payload) {return { ...state, loadedIssues: payload };},
        setLoadedSources(state, payload) {return { ...state, loadedSources: payload };},
        setLoadedLabels(state, payload) {return { ...state, loadedLabels: payload };},
        setLoadedQueries(state, payload) {return { ...state, loadedQueries: payload };},
    },

    effects: {

    }
};

