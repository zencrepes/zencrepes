import _ from 'lodash';
import {cfgLabels, cfgSources} from "../../../data/Minimongo";

export default {
    state: {
        loading: false,         // Boolean to indicate issues are currently loading
        loadFlag: false,        // Boolean to trigger issue load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded

        stageFlag: false,       // Boolean to trigger the staging of the action. Gives an opportunity for review before actually loading

        labels: [],             // Array of issues used for milestones creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ
        verifiedLabels: [],      // Array of milestones that were updated in GitHub

        verifFlag: false,       // Flag to trigger verification against GitHub
        verifying: false,       // Boolean to indicate verification is currently taking place
        verifyingMsg: null,     // Message to be displayed while issues are being verified

        onSuccess: () => {},        // Function to be executed at successful completion
        onCancel: () => {},         // Function to be executed if user cancel stage
        onStagingSuccess: () => {}, // Function to be executed if successful stage
        onStagingCancel: () => {},  // Function to be executed if staging is cancelled

        action: null,               // Action to be performed
        loadedCount: 0,

        selectedName: '',           // Label name currently selected
        deleteWarning: false,       // Display the delete warning

        allRepos: [],
        selectedRepos: [],
        selectedLabels: [],
        selectedColors: [],

        updateName: false,          // Flag to indicate if the name should be updated
        updateDescription: false,   // Flag to indicate if the description should be updated
        updateColor: false,         // Flag to indicate if the color should be updated

        newName: '',                // Name to update to
        newDescription: '',         // Description to update to
        newColor: '',               // Color to update to
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setStageFlag(state, payload) {return { ...state, stageFlag: payload };},

        setLabels(state, payload) {return { ...state, labels: payload };},

        setVerifFlag(state, payload) {return { ...state, verifFlag: payload };},
        setVerifying(state, payload) {return { ...state, verifying: payload };},
        setVerifyingMsg(state, payload) {return { ...state, verifyingMsg: payload };},
        setVerifiedLabels(state, payload) {return { ...state, verifiedLabels: payload };},
        insVerifiedLabels(state, payload) {
            let newArray = state.verifiedLabels.slice();
            newArray.splice(newArray.length, 0, payload);
            return { ...state, verifiedLabels: newArray};
        },

        setOnSuccess(state, payload) {return { ...state, onSuccess: payload };},
        setOnCancel(state, payload) {return { ...state, onCancel: payload };},
        setOnStagingSuccess(state, payload) {return { ...state, onStagingSuccess: payload };},
        setOnStagingCancel(state, payload) {return { ...state, onStagingCancel: payload };},

        setAction(state, payload) {return { ...state, action: payload };},

        setLoadedCount(state, payload) {return { ...state, loadedCount: payload };},
        incLoadedCount(state, payload) {return { ...state, loadedCount: state.loadedCount + payload };},

        setSelectedName(state, payload) {return { ...state, selectedName: payload };},
        setDeleteWarning(state, payload) {return { ...state, deleteWarning: payload };},

        setAllRepos(state, payload) {return { ...state, allRepos: payload };},
        setSelectedRepos(state, payload) {return { ...state, selectedRepos: payload };},
        setSelectedLabels(state, payload) {return { ...state, selectedLabels: payload };},

        setSelectedColors(state, payload) {return { ...state, selectedColors: payload };},

        setUpdateName(state, payload) {return { ...state, updateName: payload };},
        setUpdateDescription(state, payload) {return { ...state, updateDescription: payload };},
        setUpdateColor(state, payload) {return { ...state, updateColor: payload };},
        setNewName(state, payload) {return { ...state, newName: payload };},
        setNewDescription(state, payload) {return { ...state, newDescription: payload };},
        setNewColor(state, payload) {return { ...state, newColor: payload };},
    },

    effects: {
        async initConfiguration(labelName) {
            this.setSelectedName(labelName);

            let allRepos = cfgSources.find({}).map((repo) => {
                return {
                    value: repo.id,
                    label: repo.org.login + "/" + repo.name
                }
            });
            allRepos = _.sortBy(allRepos, 'label');
            this.setAllRepos(allRepos);

            const selectedRepos = cfgLabels.find({name: labelName}).map(label => label.repo).map(repo => repo.id);
            console.log(cfgLabels.find({name: labelName}).fetch());
            console.log(selectedRepos);
            this.updateSelectedRepos(selectedRepos);

        },
        async updateSelectedRepos(selectedRepos, rootState) {
            this.setSelectedRepos(selectedRepos);
            let selectedLabels = cfgLabels.find({name: rootState.labelsEdit.selectedName, "repo.id":{"$in":selectedRepos}}).fetch();
            this.setSelectedLabels(selectedLabels);
            //{"org.name":{"$in":["Overture","Human Cancer Models Initiative - Catalog"]}}
        },

        async resetValues() {
            console.log('resetValues');
            this.setUpdateName(false);
            this.setUpdateDescription(false);
            this.setUpdateColor(false);
            this.setNewName('');
            this.setNewDescription('');
            this.setNewColor('');
        },
    }
};

