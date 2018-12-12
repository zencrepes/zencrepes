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

        action: null,           // Action to be performed, create or delete

        milestones: [],         // Array of issues used for milestones creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ
        verifiedMilestones: [], // Array of milestones that were updated in GitHub

        onSuccess: () => {},        // Function to be executed at successful completion
        onCancel: () => {},         // Function to be executed if user cancel stage
        onStagingSuccess: () => {}, // Function to be executed if successful stage
        onStagingCancel: () => {},  // Function to be executed if staging is cancelled

        loadedCount: 0,

        editMilestoneTitle: null,
        editMilestoneDescription: null,
        editMilestoneDueDate: null,
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
        setVerifiedMilestones(state, payload) {return { ...state, verifiedMilestones: payload };},

        insVerifiedMilestones(state, payload) {
            let newArray = state.verifiedMilestones.slice();
            newArray.splice(newArray.length, 0, payload);
            return { ...state, verifiedMilestones: newArray};
        },

        setAction(state, payload) {return { ...state, action: payload };},

        setMilestones(state, payload) {return { ...state, milestones: payload };},

        setOnSuccess(state, payload) {return { ...state, onSuccess: payload };},
        setOnCancel(state, payload) {return { ...state, onCancel: payload };},
        setOnStagingSuccess(state, payload) {return { ...state, onStagingSuccess: payload };},
        setOnStagingCancel(state, payload) {return { ...state, onStagingCancel: payload };},

        setLoadedCount(state, payload) {return { ...state, loadedCount: payload };},
        incrementLoadedCount(state, payload) {return { ...state, loadedCount: state.loadedCount + payload };},

        setEditMilestoneTitle(state, payload) {return { ...state, editMilestoneTitle: payload };},
        setEditMilestoneDescription(state, payload) {return { ...state, editMilestoneDescription: payload };},
        setEditMilestoneDueDate(state, payload) {return { ...state, editMilestoneDueDate: payload };},

    },
    effects: {

    }
};