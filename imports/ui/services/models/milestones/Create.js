export default {
    state: {
        loading: false,         // Boolean to indicate issues are currently loading
        loadFlag: false,        // Boolean to trigger issue load
        loadError: false,       // Is there an error during load
        loadSuccess: false,     // Was data successfully loaded
        stageFlag: false,       // Boolean to trigger the staging of the action. Gives an opportunity for review before actually loading

        verifFlag: false,       // Flag to trigger verification against GitHub
        verifying: false,       // Boolean to indicate verification is currently taking place
        verifyingMsg: null,     // Message to be displayed while issues are being verified

        repos: [],              // Array of repos used for milestones creation/closing.
        verifiedRepos: [],      // Array of repos that were verified in GitHub

        onSuccess: () => {},        // Function to be executed at successful completion
        onCancel: () => {},         // Function to be executed if user cancel stage

        milestoneTitle: null,
        milestoneDescription: null,
        milestoneDueDate: null,

        loadedCount: 0,

    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setLoading(state, payload) {return { ...state, loading: payload };},
        setLoadError(state, payload) {return { ...state, loadError: payload };},
        setLoadSuccess(state, payload) {return { ...state, loadSuccess: payload };},

        setStageFlag(state, payload) {return { ...state, stageFlag: payload };},

        setVerifFlag(state, payload) {return { ...state, verifFlag: payload };},
        setVerifying(state, payload) {return { ...state, verifying: payload };},
        setVerifyingMsg(state, payload) {return { ...state, verifyingMsg: payload };},

        setRepos(state, payload) {return { ...state, repos: payload };},
        setVerifiedRepos(state, payload) {return { ...state, verifiedRepos: payload };},
        insVerifiedRepos(state, payload) {
            let newArray = state.verifiedRepos.slice();
            newArray.splice(newArray.length, 0, payload);
            return { ...state, verifiedRepos: newArray};
        },

        setOnSuccess(state, payload) {return { ...state, onSuccess: payload };},
        setOnCancel(state, payload) {return { ...state, onCancel: payload };},

        setMilestoneTitle(state, payload) {return { ...state, milestoneTitle: payload };},
        setMilestoneDescription(state, payload) {return { ...state, milestoneDescription: payload };},
        setMilestoneDueDate(state, payload) {return { ...state, milestoneDueDate: payload };},

        setLoadedCount(state, payload) {return { ...state, loadedCount: payload };},
        incrementLoadedCount(state, payload) {return { ...state, loadedCount: state.loadedCount + payload };},
    },
    effects: {

    }
};