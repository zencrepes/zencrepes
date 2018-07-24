export default {
    state: {
        loadFlag: false,        // Flag to indicate the data should be reloaded
        loading: false,         // Data is currently loading

        name: '',               // Org Name
        repositories: []        // Repositories
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},

        setName(state, payload) {return { ...state, name: payload };},
        setRepositories(state, payload) {return { ...state, repositories: payload };},

    },
    effects: {

    }
};