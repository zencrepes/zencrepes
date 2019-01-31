import { cfgMilestones } from '../../../data/Minimongo.js';
import {buildFacets} from "../../../utils/facets/milestones.js";
import {cfgLabels, cfgSources} from "../../../data/Minimongo";

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
        setReposCount(state, payload) {return { ...state, reposCount: payload };},
    },
    effects: {
        async updateMilestones(payload, rootState) {
            this.setMilestones(cfgMilestones.find(rootState.milestonesView.query).fetch());
        },
        async updateQuery(query) {
            this.setQuery(query);
            this.updateView();
        },
        async updateView() {
            this.refreshFacets();
            this.refreshMilestones();
            this.setReposCount(cfgSources.find({'active':true}).count());
        },
        async refreshFacets(payload, rootState) {
            const log = rootState.global.log;
            const t0 = performance.now();

            const updatedFacets = buildFacets(JSON.parse(JSON.stringify(rootState.milestonesView.query)), cfgMilestones);
            this.setFacets(updatedFacets);

            const t1 = performance.now();
            log.info("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },
        async refreshMilestones(payload, rootState) {
            const milestones = cfgMilestones.find(rootState.milestonesView.query).fetch();
            this.setMilestones(milestones);
        },
        async clearMilestones() {
            cfgMilestones.remove({});
            this.setMilestones([]);
            this.setQuery({});
            this.updateView();
        },
    }
};

