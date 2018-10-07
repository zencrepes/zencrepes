import { cfgMilestones } from '../../../data/Minimongo.js';

export default {
    state: {
        query: {},
        milestones: []
    },
    reducers: {
        setMilestones(state, payload) {return { ...state, milestones: payload };},
        setQuery(state, payload) {return { ...state, query: payload };},
    },
    effects: {
        async updateMilestones(payload, rootState) {
            this.setMilestones(cfgMilestones.find(rootState.milestones.query).fetch());
        }
    }
};

