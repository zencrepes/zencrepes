import _ from 'lodash';

export default {
    state: {
        loadFlag: false,            // Flag to indicate the data should be processed
        loading: false,             // Data is currently processing
        loadingText: '',            // Text to be displayed in the dialog while loading

        action: null,               // Action to be performed

        selectedName: '',           // Label name currently selected
        deleteWarning: false,       // Display the delete warning

        availableRepos: [],         // Full unfiltered list of repos
        filteredAvailableRepos: [], // List of repo displayed to the user, it might be filtered
        toggledAvailableRepos: [],  // List of repo the user has manually selected for removal or addition
        availableFilter: '',        // Text used to filter out the results

        selectedRepos: [],
        filteredSelectedRepos: [],
        toggledSelectedRepos: [],
        selectedFilter: '',

        updateName: false,          // Flag to indicate if the name should be updated
        updateDescription: false,   // Flag to indicate if the description should be updated
        updateColor: false,         // Flag to indicate if the color should be updated

        newName: '',                // Name to update to
        newDescription: '',         // Description to update to
        newColor: '',               // Color to update to

    },
    reducers: {
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoadingText(state, payload) {return { ...state, loadingText: payload };},

        setAction(state, payload) {return { ...state, action: payload };},

        setSelectedName(state, payload) {return { ...state, selectedName: payload };},
        setDeleteWarning(state, payload) {return { ...state, deleteWarning: payload };},

        setAvailableRepos(state, payload) {return { ...state, availableRepos: payload };},
        setFilteredAvailableRepos(state, payload) {return { ...state, filteredAvailableRepos: payload };},
        setToggledAvailableRepos(state, payload) {return { ...state, toggledAvailableRepos: payload };},
        setAvailableFilter(state, payload) {return { ...state, availableFilter: payload };},

        setSelectedRepos(state, payload) {return { ...state, selectedRepos: payload };},
        setFilteredSelectedRepos(state, payload) {return { ...state, filteredSelectedRepos: payload };},
        setToggledSelectedRepos(state, payload) {return { ...state, toggledSelectedRepos: payload };},
        setSelectedFilter(state, payload) {return { ...state, selectedFilter: payload };},

        setUpdateName(state, payload) {return { ...state, updateName: payload };},
        setUpdateDescription(state, payload) {return { ...state, updateDescription: payload };},
        setUpdateColor(state, payload) {return { ...state, updateColor: payload };},
        setNewName(state, payload) {return { ...state, newName: payload };},
        setNewDescription(state, payload) {return { ...state, newDescription: payload };},
        setNewColor(state, payload) {return { ...state, newColor: payload };},

    },

    effects: {
        async initSelectedRepos(payload, rootState) {
            this.setSelectedRepos(payload);
            this.setFilteredSelectedRepos(payload);
            this.setSelectedFilter('');
        },

        async initAvailableRepos(payload, rootState) {
            this.setAvailableRepos(payload);
            this.setFilteredAvailableRepos(payload);
            this.setAvailableFilter('');
        },

        async updateSelectedFilter(payload, rootState) {
            this.setSelectedFilter(payload);
            let filteredSet = _.filter(rootState.labelsconfiguration.selectedRepos, function(repo) {
                if (repo.name.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                else {return false;}
            });
            this.setFilteredSelectedRepos(filteredSet);
        },

        async updateAvailableFilter(payload, rootState) {
            this.setAvailableFilter(payload);
            let filteredSet = _.filter(rootState.labelsconfiguration.availableRepos, function(repo) {
                if (repo.name.toLowerCase().indexOf(payload.toLowerCase()) !== -1) {return true;}
                else {return false;}
            });
            this.setFilteredAvailableRepos(filteredSet);
        },

        async addToAvailable(payload, rootState) {
            // Take what is toggled, push it to available
            let newAvailable = rootState.labelsconfiguration.availableRepos.concat(rootState.labelsconfiguration.toggledSelectedRepos);
            this.setAvailableRepos(newAvailable);
            this.setFilteredAvailableRepos(newAvailable);
            this.setAvailableFilter('');

            // Take what is toggled, remove it from selected
            var newSelected = _.differenceBy(rootState.labelsconfiguration.selectedRepos, rootState.labelsconfiguration.toggledSelectedRepos, 'id');
            this.setSelectedRepos(newSelected);
            this.setFilteredSelectedRepos(newSelected);
            this.setSelectedFilter('');

            this.setToggledAvailableRepos([]);
            this.setToggledSelectedRepos([]);
        },

        async addToSelected(payload, rootState) {
            console.log('addToSelected');

            // Take what is toggled, push it to available
            let newSelected = rootState.labelsconfiguration.selectedRepos.concat(rootState.labelsconfiguration.toggledAvailableRepos);
            this.setSelectedRepos(newSelected);
            this.setFilteredSelectedRepos(newSelected);
            this.setSelectedFilter('');

            // Take what is toggled, remove it from selected
            var newAvailable = _.differenceBy(rootState.labelsconfiguration.availableRepos, rootState.labelsconfiguration.toggledAvailableRepos, 'id');
            this.setAvailableRepos(newAvailable);
            this.setFilteredAvailableRepos(newAvailable);
            this.setAvailableFilter('');

            this.setToggledAvailableRepos([]);
            this.setToggledSelectedRepos([]);

        },

        async resetValues(payload, rootState) {
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

