export default {
    state: {
        availableRepos: [],         // Full unfiltered list of repos
        filteredAvailableRepos: [], // List of repo displayed to the user, it might be filtered
        toggledAvailableRepos: [],  // List of repo the user has manually selected for removal or addition
        availableFilter: '',        // Text used to filter out the results

        selectedRepos: [],
        filteredSelectedRepos: [],
        toggledSelectedRepos: [],
        selectedFilter: '',
    },
    reducers: {
        setAvailableRepos(state, payload) {return { ...state, availableRepos: payload };},
        setFilteredAvailableRepos(state, payload) {return { ...state, filteredAvailableRepos: payload };},
        setToggledAvailableRepos(state, payload) {return { ...state, toggledAvailableRepos: payload };},
        setAvailableFilter(state, payload) {return { ...state, availableFilter: payload };},

        setSelectedRepos(state, payload) {return { ...state, selectedRepos: payload };},
        setFilteredSelectedRepos(state, payload) {return { ...state, filteredSelectedRepos: payload };},
        setToggledSelectedRepos(state, payload) {return { ...state, toggledSelectedRepos: payload };},
        setSelectedFilter(state, payload) {return { ...state, selectedFilter: payload };},

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
    }
};

