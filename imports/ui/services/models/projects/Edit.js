import _ from 'lodash';
import {cfgProjects, cfgSources} from "../../../data/Minimongo";
import uuidv1 from "uuid/v1";

export default {
    state: {
        loadFlag: false,        // Boolean to trigger issue load
        stageFlag: false,       // Boolean to trigger the staging of the action. Gives an opportunity for review before actually loading

        projects: [],             // Array of issues used for projects creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ
        verifiedProjects: [],     // Array of projects that were updated in GitHub
        verifFlag: false,       // Flag to trigger verification against GitHub

        action: null,               // Action to be performed

        openAddRepos: false,        // Boolean to indicate if the add repo window should be displayed
        addReposAvailable: [],      // Array of available repositories
        addReposSelected: [],       // Array of selected repositories

        selectedTitle: '',           // Project title currently selected

        allRepos: [],

        newTitle: '',               // Title to update to
        newState: 'OPEN',           // State to update to
        newDueOn: '',               // DueOn to update to
        newDescription: '',         // Description to update to
        openEditDialog: false,      // Open or close edit dialog
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setStageFlag(state, payload) {return { ...state, stageFlag: payload };},

        setProjects(state, payload) {return { ...state, projects: payload };},
        setVerifiedProjects(state, payload) {return { ...state, verifiedProjects: payload };},
        insVerifiedProjects(state, payload) {
            let newArray = state.verifiedProjects.slice();
            newArray.splice(newArray.length, 0, payload);
            return { ...state, verifiedProjects: newArray};
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
        setNewDescription(state, payload) {return { ...state, newDescription: payload };},
        setOpenEditDialog(state, payload) {return { ...state, openEditDialog: payload };},
    },

    effects: {
        async initConfiguration(projectTitle) {
            this.setSelectedTitle(projectTitle);

            let allRepos = cfgSources.find({}).map((repo) => {
                return {
                    value: repo.id,
                    project: repo.org.login + "/" + repo.name
                }
            });
            allRepos = _.sortBy(allRepos, 'project');
            this.setAllRepos(allRepos);

            const selectedRepos = cfgProjects.find({title: projectTitle}).map(project => project.repo).map(repo => repo.id);
            this.updateSelectedRepos(selectedRepos);

        },
        async updateSelectedRepos(selectedRepos, rootState) {
            this.setSelectedRepos(selectedRepos);
            let selectedProjects = cfgProjects.find({title: rootState.projectsEdit.selectedTitle, "repo.id":{"$in":selectedRepos}}).fetch();
            this.setSelectedProjects(selectedProjects);
            //{"org.name":{"$in":["Overture","Human Cancer Models Initiative - Catalog"]}}
        },

        async startEditingProject(project, rootState) {
            const projects = rootState.projectsEdit.projects;

            const editProjectTitle = projects[0].title;
            this.setNewTitle(editProjectTitle);

            const editProjectState = projects[0].state;
            this.setNewState(editProjectState);

            let editProjectDueOn = null;
            // Get the first project without dueOn
            const projects_due = projects.filter(mls => (mls.dueOn !== '' && mls.dueOn !== null));
            if (projects_due.length > 0) {
                editProjectDueOn = projects_due[0].dueOn;
            }
            this.setNewDueOn(editProjectDueOn);

            let editProjectDescription = null;
            const projects_description = projects.filter(mls => (mls.description !== '' && mls.description !== null));
            if (projects_description.length > 0) {
                editProjectDescription = projects_description[0].description;
            }
            this.setNewDescription(editProjectDescription);

            this.setAction('update');
            this.setOpenEditDialog(true);
        },

        async resetValues() {
            this.setNewTitle('');
            this.setNewDueOn(null);
            this.setNewState('OPEN');
        },

        async addRepoUpdateSelected(selectedRepos, rootState) {
            this.setAddReposSelected(selectedRepos);
            // Prepare projects
            const projects = selectedRepos.map(mls => {
                const repo = cfgSources.findOne({'active': true, 'id': mls});
                return {
                    id: uuidv1(),
                    repo: repo,
                    org: repo.org,
                    number: 0,
                    title: rootState.projectsEdit.newTitle,
                    dueOn: rootState.projectsEdit.newDueOn,
                    state: rootState.projectsEdit.newState,
                    description: rootState.projectsEdit.newDescription,
                    issues: {totalCount: 0},
                    pullRequests: {totalCount: 0},
                    updatedAt: null,
                }
            });
            this.setProjects(projects);
        },

        async updateAvailableRepos(projects) {
            const selectedProjectsRepos = projects.map(mls => mls.repo.id);
            const availableRepos = cfgSources.find({'active': true, 'id':{'$nin':selectedProjectsRepos}}).fetch();
            this.setAddReposAvailable(availableRepos.map((repo) => {
                return {
                    value: repo.id,
                    label: repo.org.login + "/" + repo.name
                }
            }));

        },
    }
};

