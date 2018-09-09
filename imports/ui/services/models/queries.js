
export default {
    state: {
        openQueryManager: false,
        openSaveQuery: false,
        filters: {}
    },
    reducers: {
        setOpenQueryManager(state, payload) {return { ...state, openQueryManager: payload };},
        setOpenSaveQuery(state, payload) {return { ...state, openSaveQuery: payload };},
        setFilters(state, payload) {return { ...state, filters: payload };},
    },
    effects: {

    }
};