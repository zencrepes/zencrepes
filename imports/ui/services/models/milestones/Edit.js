import _ from 'lodash';
import {cfgMilestones, cfgSources} from "../../../data/Minimongo";
import uuidv1 from "uuid/v1";

export default {
    state: {
        loadFlag: false,        // Boolean to trigger issue load
        stageFlag: false,       // Boolean to trigger the staging of the action. Gives an opportunity for review before actually loading

        milestones: [],             // Array of issues used for milestones creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ
        verifiedMilestones: [],     // Array of milestones that were updated in GitHub
        verifFlag: false,       // Flag to trigger verification against GitHub

        action: null,               // Action to be performed

        openAddRepos: false,        // Boolean to indicate if the add repo window should be displayed
        addReposAvailable: [],      // Array of available repositories
        addReposSelected: [],       // Array of selected repositories

        selectedTitle: '',           // Milestone title currently selected

        allRepos: [],

        newTitle: '',                // Title to update to
        newState: 'OPEN',           // State to update to
        newDueOn: '',               // DueOn to update to
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setStageFlag(state, payload) {return { ...state, stageFlag: payload };},

        setMilestones(state, payload) {return { ...state, milestones: payload };},
        setVerifiedMilestones(state, payload) {return { ...state, verifiedMilestones: payload };},
        insVerifiedMilestones(state, payload) {
            let newArray = state.verifiedMilestones.slice();
            newArray.splice(newArray.length, 0, payload);
            return { ...state, verifiedMilestones: newArray};
        },
        setVerifFlag(state, payload) {return { ...state, verifFlag: payload };},

        setAction(state, payload) {return { ...state, action: payload };},

        setOpenAddRepos(state, payload) {return { ...state, openAddRepos: payload };},
        setAddReposAvailable(state, payload) {return { ...state, addReposAvailable: payload };},
        setAddReposSelected(state, payload) {return { ...state, addReposSelected: payload };},

        setSelectedTitle(state, payload) {return { ...state, selectedTitle: payload };},

        setAllRepos(state, payload) {return { ...state, allRepos: payload };},

        setNewTitle(state, payload) {return { ...state, newTitle: payload };},
        setNewState(state, payload) {return { ...state, newState: payload };},
        setNewDueOn(state, payload) {return { ...state, newDueOn: payload };},
    },

    effects: {
        async initConfiguration(milestoneTitle) {
            this.setSelectedTitle(milestoneTitle);

            let allRepos = cfgSources.find({}).map((repo) => {
                return {
                    value: repo.id,
                    milestone: repo.org.login + "/" + repo.name
                }
            });
            allRepos = _.sortBy(allRepos, 'milestone');
            this.setAllRepos(allRepos);

            const selectedRepos = cfgMilestones.find({title: milestoneTitle}).map(milestone => milestone.repo).map(repo => repo.id);
            this.updateSelectedRepos(selectedRepos);

        },
        async updateSelectedRepos(selectedRepos, rootState) {
            this.setSelectedRepos(selectedRepos);
            let selectedMilestones = cfgMilestones.find({title: rootState.milestonesEdit.selectedTitle, "repo.id":{"$in":selectedRepos}}).fetch();
            this.setSelectedMilestones(selectedMilestones);
            //{"org.name":{"$in":["Overture","Human Cancer Models Initiative - Catalog"]}}
        },

        async startEditingMilestone(milestone, rootState) {
            console.log('startEditingMilestone');
            if (milestone !== undefined) {
                const milestones = rootState.milestonesView.milestones.filter(mls => mls.title === milestone);
                this.setMilestones(milestones);

                const editMilestoneTitle = milestones[0].title;
                this.setNewTitle(editMilestoneTitle);

                const editMilestoneState = milestones[0].state;
                this.setNewState(editMilestoneState);

                let editMilestoneDueOn = new Date().toISOString();
                // Get the first milestone without dueOn
                const milestones_due = milestones.filter(mls => (mls.dueOn !== '' && mls.dueOn !== null));
                if (milestones_due.length > 0) {
                    editMilestoneDueOn = milestones_due[0].dueOn;
                }
                console.log(editMilestoneDueOn);
                this.setNewDueOn(editMilestoneDueOn);
            }
        },

        async resetValues() {
            this.setNewTitle('');
            this.setNewDueOn(null);
            this.setNewState('OPEN');
        },

        async addRepoUpdateSelected(selectedRepos, rootState) {
            this.setAddReposSelected(selectedRepos);
            // Prepare milestones
            const milestones = selectedRepos.map(mls => {
                const repo = cfgSources.findOne({'active': true, 'id': mls});
                return {
                    id: uuidv1(),
                    repo: repo,
                    org: repo.org,
                    number: 0,
                    title: rootState.milestonesEdit.newTitle,
                    dueOn: rootState.milestonesEdit.newDueOn,
                    state: rootState.milestonesEdit.newState,
                    issues: {totalCount: 0},
                    pullRequests: {totalCount: 0},
                    updatedAt: null,
                }
            });
            this.setMilestones(milestones);
        },

        async updateAvailableRepos(milestones) {
            const selectedMilestonesRepos = milestones.map(mls => mls.repo.id);
            const availableRepos = cfgSources.find({'active': true, 'id':{'$nin':selectedMilestonesRepos}}).fetch();
            this.setAddReposAvailable(availableRepos.map((repo) => {
                return {
                    value: repo.id,
                    milestone: repo.org.login + "/" + repo.name
                }
            }));
        },
    }
};

