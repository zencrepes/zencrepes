export default {
    state: {
        verifFlag: false,       // Flag to trigger verification against GitHub
        verifying: false,       // Boolean to indicate verification is currently taking place
        verifyingMsg: null,     // Message to be displayed while issues are being verified

        action: null,           // Action to be performed

        issues: [],             // Array of issues used for milestones creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ
        verifiedIssues: [],     // Array of issues that were updated in GitHub

        onSuccess: () => {},        // Function to be executed at successful completion
        verifySuccess: false    // Flag to indicate completion
    },
    reducers: {
        setStageFlag(state, payload) {return { ...state, stageFlag: payload };},
        setIssues(state, payload) {return { ...state, issues: payload };},

        setVerifFlag(state, payload) {return { ...state, verifFlag: payload };},
        setVerifying(state, payload) {return { ...state, verifying: payload };},
        setVerifyingMsg(state, payload) {return { ...state, verifyingMsg: payload };},
        setVerifiedIssues(state, payload) {return { ...state, verifiedIssues: payload };},

        insVerifiedIssues(state, payload) {
            let newArray = state.verifiedIssues.slice();
            newArray.splice(newArray.length, 0, payload);
            return { ...state, verifiedIssues: newArray};
        },

        setAction(state, payload) {return { ...state, action: payload };},

        setOnSuccess(state, payload) {return { ...state, onSuccess: payload };},
        setVerifySuccess(state, payload) {return { ...state, verifySuccess: payload };},
    },
    effects: {
    }
};
