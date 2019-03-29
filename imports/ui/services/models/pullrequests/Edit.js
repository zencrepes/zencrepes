export default {
    state: {
        loadFlag: false,        // Boolean to trigger pullrequest load
        stageFlag: false,       // Boolean to trigger the staging of the action. Gives an opportunity for review before actually loading

        pullrequests: [],             // Array of pullrequests used for pullrequests creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ
        verifiedPullrequests: [],     // Array of pullrequests that were updated in GitHub
        verifFlag: false,       // Flag to trigger verification against GitHub

        action: null,               // Action to be performed

        agileLabels: [],            // Agile labels available to the pullrequest
        agileNewState: '',
    },
    reducers: {
        setLoadFlag(state, payload) {return { ...state, loadFlag: payload };},
        setStageFlag(state, payload) {return { ...state, stageFlag: payload };},

        setPullrequests(state, payload) {return { ...state, pullrequests: payload };},
        setVerifiedPullrequests(state, payload) {return { ...state, verifiedPullrequests: payload };},
        insVerifiedPullrequests(state, payload) {
            let newArray = state.verifiedPullrequests.slice();
            newArray.splice(newArray.length, 0, payload);
            return { ...state, verifiedPullrequests: newArray};
        },
        setVerifFlag(state, payload) {return { ...state, verifFlag: payload };},

        setAction(state, payload) {return { ...state, action: payload };},
        setAgileLabels(state, payload) {return { ...state, agileLabels: payload };},
        setAgileNewState(state, payload) {return { ...state, agileNewState: payload };},
    },
    effects: {
    }
};
