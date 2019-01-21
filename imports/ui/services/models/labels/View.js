import { cfgLabels, cfgSources } from '../../../data/Minimongo.js';
import {buildFacets} from "../../../utils/facets/labels.js";

export default {
    state: {
        query: {},
        labels: [],
        facets: [],

        reposCount: 0,
    },
    reducers: {
        setLabels(state, payload) {return { ...state, labels: payload };},
        setQuery(state, payload) {return { ...state, query: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},
        setReposCount(state, payload) {return { ...state, reposCount: payload };},
    },
    effects: {
        async updateLabels(payload, rootState) {
            this.setLabels(cfgLabels.find(rootState.labelsView.query).fetch());
        },
        async updateQuery(query) {
            this.setQuery(query);
            this.updateView();
        },
        async updateView() {
            this.refreshFacets();
            this.refreshLabels();
            this.setReposCount(cfgSources.find({'active':true}).count());
        },
        async refreshFacets(payload, rootState) {
            const log = rootState.global.log;
            const t0 = performance.now();

            const updatedFacets = buildFacets(JSON.parse(JSON.stringify(rootState.labelsView.query)), cfgLabels);
            this.setFacets(updatedFacets);

            const t1 = performance.now();
            log.info("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },
        async refreshLabels(payload, rootState) {
            const labels = cfgLabels.find(rootState.labelsView.query).fetch();
            this.setLabels(labels);
        },
    }
};

