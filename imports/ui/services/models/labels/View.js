import { cfgLabels } from '../../../data/Minimongo.js';

export default {
    state: {
        query: {},
        labels: []
    },
    reducers: {
        setLabels(state, payload) {return { ...state, labels: payload };},
        setQuery(state, payload) {return { ...state, query: payload };},
    },
    effects: {
        async updateLabels(payload, rootState) {
            this.setLabels(cfgLabels.find(rootState.labelsView.query).fetch());
        }
    }
};

