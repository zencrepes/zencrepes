/*
    This redux store is used to manage the global loading state
 */
const timeout = ms => new Promise(res => setTimeout(res, ms))

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
        async updateLoading(payload, rootState) {
            this.setLoading(payload);
            this.setMessage('');
            await timeout(50);
        },
        async updateMessage(payload, rootState) {
            this.setMessage(payload);
            await timeout(50);
        }
    }
};