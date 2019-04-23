import _ from 'lodash';

import {
    cfgSources,
    cfgLabels,
    cfgMilestones,
    cfgIssues
} from '../../../data/Minimongo.js';

export default {
    state: {
        selectedRepos: [],
        availableRepos: [],

        treeNodes: [],          // Formated nodes for treeview

        orgCountTotal: 0,
        orgCountSelected: 0,
        issuesCountTotal: 0,
        issuesCountSelected: 0,
        issuesCountLoaded: 0,
        pullrequestsCountTotal: 0,
        pullrequestsCountSelected: 0,
        pullrequestsCountLoaded: 0,
        labelsCountTotal: 0,
        labelsCountSelected: 0,
        labelsCountLoaded: 0,
        projectsCountTotal: 0,
        projectsCountSelected: 0,
        projectsCountLoaded: 0,
        milestonesCountTotal: 0,
        milestonesCountSelected: 0,
        milestonesCountLoaded: 0,
    },
    reducers: {
        setSelectedRepos(state, payload) {return { ...state, selectedRepos: payload };},
        setAvailableRepos(state, payload) {return { ...state, availableRepos: payload };},
        setTreeNodes(state, payload) {return { ...state, treeNodes: payload };},

        setOrgCountTotal(state, payload) {return { ...state, orgCountTotal: payload };},
        setOrgCountSelected(state, payload) {return { ...state, orgCountSelected: payload };},
        setIssuesCountTotal(state, payload) {return { ...state, issuesCountTotal: payload };},
        setIssuesCountSelected(state, payload) {return { ...state, issuesCountSelected: payload };},
        setIssuesCountLoaded(state, payload) {return { ...state, issuesCountLoaded: payload };},
        setPullrequestsCountTotal(state, payload) {return { ...state, pullrequestsCountTotal: payload };},
        setPullrequestsCountSelected(state, payload) {return { ...state, pullrequestsCountSelected: payload };},
        setPullrequestsCountLoaded(state, payload) {return { ...state, pullrequestsCountLoaded: payload };},
        setLabelsCountTotal(state, payload) {return { ...state, labelsCountTotal: payload };},
        setLabelsCountSelected(state, payload) {return { ...state, labelsCountSelected: payload };},
        setLabelsCountLoaded(state, payload) {return { ...state, labelsCountLoaded: payload };},
        setProjectsCountTotal(state, payload) {return { ...state, projectsCountTotal: payload };},
        setProjectsCountSelected(state, payload) {return { ...state, projectsCountSelected: payload };},
        setProjectsCountLoaded(state, payload) {return { ...state, projectsCountLoaded: payload };},
        setMilestonesCountTotal(state, payload) {return { ...state, milestonesCountTotal: payload };},
        setMilestonesCountSelected(state, payload) {return { ...state, milestonesCountSelected: payload };},
        setMilestonesCountLoaded(state, payload) {return { ...state, milestonesCountLoaded: payload };},
    },

    effects: {
        async initView() {
            this.setSelectedRepos(cfgSources.find({active: true}).fetch());
            this.setAvailableRepos(cfgSources.find({}).fetch());

            this.updateTreeNodes(cfgSources.find({}).fetch());
            this.updateCounts();
//            this.setMilestones(cfgMilestones.find(rootState.milestonesView.query).fetch());
        },

        async clearRepos() {
            cfgSources.remove({});
            this.setSelectedRepos([]);
            this.setAvailableRepos([]);

            this.updateTreeNodes([]);
            this.updateCounts();
        },


        async updateTreeNodes(allRepos, rootState) {
            const log = rootState.global.log;
            const t0 = performance.now();

            const uniqueOrgs = _.toArray(_.groupBy(allRepos, 'org.login'));
            const treeNodes = _.orderBy(uniqueOrgs.map((org) => {
                return {
                    label: org[0].org.name,
                    value: org[0].org.login,
                    children: _.orderBy(org.map((repo) => {
                        return {
                            label: repo.name,
                            value: repo.id
                        };
                    }), [repo => repo.label.toLowerCase()])
                };
            }), [org => org.label.toLowerCase()]);
            this.setTreeNodes(treeNodes);

            const t1 = performance.now();
            log.info("updateTreeNodes - took " + (t1 - t0) + " milliseconds.");
        },

        async updateCheckedRepos(checked, rootState) {
            const log = rootState.global.log;
            const t0 = performance.now();

            await cfgSources.update({}, { $set: { active: false } }, {multi: true});
            checked.forEach(async (checkedId) => {
                await cfgSources.update({id: checkedId}, { $set: { active: true } }, {multi: false});
            });
            this.setSelectedRepos(cfgSources.find({ active: true }).fetch());

            const t1 = performance.now();
            log.info("updateCheckedRepos - took " + (t1 - t0) + " milliseconds.");

            this.updateCounts();
        },

        async updateCounts(payload, rootState) {
            const log = rootState.global.log;
            const t0 = performance.now();

            const availableRepos = cfgSources.find({}).fetch();
            const selectedRepos = cfgSources.find({active: true}).fetch();

            this.setOrgCountTotal(Object.keys(_.groupBy(availableRepos, 'org.login')).length);
            this.setOrgCountSelected(Object.keys(_.groupBy(selectedRepos, 'org.login')).length);

            this.setIssuesCountTotal(availableRepos.map(repo => repo.issues.totalCount).reduce((acc, count) => acc + count, 0));
            this.setIssuesCountSelected(selectedRepos.map(repo => repo.issues.totalCount).reduce((acc, count) => acc + count, 0));
            this.setIssuesCountLoaded(cfgIssues.find().count());
            this.setPullrequestsCountTotal(availableRepos.map(repo => repo.pullRequests.totalCount).reduce((acc, count) => acc + count, 0));
            this.setPullrequestsCountSelected(selectedRepos.map(repo => repo.pullRequests.totalCount).reduce((acc, count) => acc + count, 0));
            this.setPullrequestsCountLoaded(cfgIssues.find().count());
            this.setLabelsCountTotal(availableRepos.map(repo => repo.labels.totalCount).reduce((acc, count) => acc + count, 0));
            this.setLabelsCountSelected(selectedRepos.map(repo => repo.labels.totalCount).reduce((acc, count) => acc + count, 0));
            this.setLabelsCountLoaded(cfgLabels.find().count());
            this.setProjectsCountTotal(availableRepos.map(repo => repo.projects.totalCount).reduce((acc, count) => acc + count, 0));
            this.setProjectsCountSelected(selectedRepos.map(repo => repo.projects.totalCount).reduce((acc, count) => acc + count, 0));
            this.setProjectsCountLoaded(0);
            this.setMilestonesCountTotal(availableRepos.map(repo => repo.milestones.totalCount).reduce((acc, count) => acc + count, 0));
            this.setMilestonesCountSelected(selectedRepos.map(repo => repo.milestones.totalCount).reduce((acc, count) => acc + count, 0));
            this.setMilestonesCountLoaded(cfgMilestones.find().count());

            const t1 = performance.now();
            log.info("updateCounts - took " + (t1 - t0) + " milliseconds.");

        }
    }
};

