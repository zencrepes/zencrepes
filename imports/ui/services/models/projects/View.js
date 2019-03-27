import { cfgProjects, cfgSources, cfgIssues } from '../../../data/Minimongo.js';
import {buildFacets} from "../../../utils/facets/projects.js";

export default {
    state: {
        query: {},
        projects: [],
        facets: [],

    },
    reducers: {
        setProjects(state, payload) {return { ...state, projects: payload };},
        setQuery(state, payload) {return { ...state, query: payload };},
        setFacets(state, payload) {return { ...state, facets: payload };},
        setReposCount(state, payload) {return { ...state, reposCount: payload };},
    },
    effects: {
        async updateProjects(payload, rootState) {
            this.setProjects(cfgProjects.find(rootState.projectsView.query).fetch());
        },
        async updateQuery(query) {
            this.setQuery(query);
            this.updateView();
        },
        async updateView() {
            this.refreshFacets();
            this.refreshProjects();
            this.setReposCount(cfgSources.find({'active':true}).count());
        },
        async refreshFacets(payload, rootState) {
            const log = rootState.global.log;
            const t0 = performance.now();

            const updatedFacets = buildFacets(JSON.parse(JSON.stringify(rootState.projectsView.query)), cfgProjects);
            this.setFacets(updatedFacets);

            const t1 = performance.now();
            log.info("refreshFacets - took " + (t1 - t0) + " milliseconds.");
        },
        async refreshProjects(payload, rootState) {
            const projects = cfgProjects.find(rootState.projectsView.query).fetch();
            const projectsIssues = projects.map((project) => {
                return {
                    ...project,
                    issues: cfgIssues.find({'projectCards.edges.node.project.id':project.id}).fetch()
                }
            })
            this.setProjects(projectsIssues);
        },
        async clearProjects() {
            cfgProjects.remove({});
            this.setProjects([]);
            this.setQuery({});
            this.updateView();
        },
    }
};

