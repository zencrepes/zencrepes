/*
    This redux store is used to manage the global loading state
 */
export default {
    state: {
        loading: false,
        message: '',
    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setMessage(state, payload) {return { ...state, message: payload };},
    },
    effects: {

    }
};