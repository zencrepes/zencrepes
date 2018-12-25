import { cfgMilestones } from '../../../data/Minimongo.js';
import {buildFacets} from "../../../utils/facets/milestones.js";

export default {
    state: {
        query: {},
        milestones: [],
        facets: [],

    },
    reducers: {
        setMilestones(state, payload) {return { ...state, milestones: payload };},
        setQuery(state, payload) {return { ...state, query: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},
    },
    effects: {
        async updateMilestones(payload, rootState) {
            this.setMilestones(cfgMilestones.find(rootState.milestonesView.query).fetch());
        },
        async updateQuery(query) {
            console.log('updateQuery: ' + JSON.stringify(query));
            this.setQuery(query);
            this.updateView();
        },
        async updateView() {
            this.refreshFacets();
            this.refreshMilestones();
        },
        async refreshFacets(payload, rootState) {
            console.log('refreshFacets');
            const t0 = performance.now();

            const updatedFacets = buildFacets(JSON.parse(JSON.stringify(rootState.milestonesView.query)), cfgMilestones);
            this.setFacets(updatedFacets);

            const t1 = performance.now();
            console.log("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },
        async refreshMilestones(payload, rootState) {
            console.log('refreshMilestones');
            const milestones = cfgMilestones.find(rootState.milestonesView.query).fetch();
            this.setMilestones(milestones);
        },

    }
};

