export default {
    state: {
        loadedIssues: false,
        loadedSources: false,
        loadedLabels: false,
        loadedQueries: false,
        loadedMilestones: false,
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

