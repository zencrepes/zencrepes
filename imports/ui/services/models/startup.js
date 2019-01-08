export default {
    state: {
        loadedIssues: null,
        loadedSources: null,
        loadedLabels: null,
        loadedQueries: null,
        loadedMilestones: null,
    },
    reducers: {
        setLoadedIssues(state, payload) {return { ...state, loadedIssues: payload };},
        setLoadedSources(state, payload) {return { ...state, loadedSources: payload };},
        setLoadedLabels(state, payload) {return { ...state, loadedLabels: payload };},
        setLoadedQueries(state, payload) {return { ...state, loadedQueries: payload };},
        setLoadedMilestones(state, payload) {return { ...state, loadedMilestones: payload };},
    },

    effects: {

    }
};

