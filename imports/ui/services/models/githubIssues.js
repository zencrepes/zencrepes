export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading
        loadedCount: 0,         // Count of items actually loaded
        loadedCountBuffer: 0,   // Count of items that will be loaded in next increment
        totalCount: 0,          // Total number of items that should be loaded
    },
    reducers: {
        setLoading(state, payload) {console.log('set loading'); console.log(payload);return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadedCount(state, payload) {return { ...state, loadedCount: payload };},
        setLoadedCountBuffer(state, payload) {return { ...state, loadedCountBuffer: payload };},
        setTotalCount(state, payload) {return { ...state, totalCount: payload };},

        incrementLoadedCount(state, payload) {return { ...state, loadedCount: state.loadedCount + payload };},
        incrementLoadedCountBuffer(state, payload) {return { ...state, loadedCountBuffer: state.loadedCountBuffer + payload };},

    },
    effects: {

    }
};

