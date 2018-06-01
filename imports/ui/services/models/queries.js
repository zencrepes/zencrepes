
export default {
    state: {
        openQueryManager: false,
        openSaveQuery: false,
    },
    reducers: {
        setOpenQueryManager(state, payload) {
            return { ...state, openQueryManager: payload };
        },
        setOpenSaveQuery(state, payload) {
            return { ...state, openSaveQuery: payload };
        },
    },
    effects: {

    }
};