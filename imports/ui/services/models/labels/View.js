import { cfgLabels } from '../../../data/Minimongo.js';
import {buildFacets} from "../../../utils/facets/labels.js";

export default {
    state: {
        query: {},
        labels: [],
        facets: [],

    },
    reducers: {
        setLabels(state, payload) {return { ...state, labels: payload };},
        setQuery(state, payload) {return { ...state, query: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},

    },
    effects: {
        async updateLabels(payload, rootState) {
            this.setLabels(cfgLabels.find(rootState.labelsView.query).fetch());
        },
        async updateQuery(query, rootState) {
            console.log('updateQuery: ' + JSON.stringify(query));
            this.setQuery(query);
            this.updateView();
        },
        async updateView(payload, rootState) {
            this.refreshFacets();
            this.refreshLabels();
        },
        async refreshFacets(payload, rootState) {
            console.log('refreshFacets');
            const t0 = performance.now();

            const updatedFacets = buildFacets(JSON.parse(JSON.stringify(rootState.labelsView.query)), cfgLabels);
            this.setFacets(updatedFacets);

            const t1 = performance.now();
            console.log("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },
        async refreshLabels(payload, rootState) {
            console.log('refreshLabels');
            const labels = cfgLabels.find(rootState.labelsView.query).fetch();
            this.setLabels(labels);
        },
    }
};

