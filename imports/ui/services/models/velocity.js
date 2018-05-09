import { cfgIssues } from '../../data/Issues.js';


export default {
    state: {
        loading: false,
    },
    reducers: {
        setLoading(state, payload) {
            console.log('setLoading');
            return { ...state, loading: payload };
        },
    },
    effects: {
        async initStates(payload, rootState) {
            console.log('Init state');
        }
    }
};