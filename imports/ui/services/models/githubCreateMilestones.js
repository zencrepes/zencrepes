export default {
    state: {
        loading: false,         // Boolean to indicate issues are currently loading
        loadFlag: false,        // Boolean to trigger issue load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded
        action: null,           // Action to be performed, create or delete

        milestones: [],   // Array of issues used for milestones creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ

        loadedCount: 0,
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},
        setAction(state, payload) {return { ...state, action: payload };},

        setMilestones(state, payload) {return { ...state, milestones: payload };},

        setLoadedCount(state, payload) {return { ...state, loadedCount: payload };},
        incrementLoadedCount(state, payload) {return { ...state, loadedCount: state.loadedCount + payload };},

    },
    effects: {

    }
};