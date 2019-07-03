import uuidv1 from "uuid/v1";

export default {
  state: {
    loadFlag: false, // Boolean to trigger issue load
    stageFlag: false, // Boolean to trigger the staging of the action. Gives an opportunity for review before actually loading

    issues: [], // Array of issues used for issues creation/closing. - Format for due date: Format: YYYY-MM-DDTHH:MM:SSZ
    verifiedIssues: [], // Array of issues that were updated in GitHub
    verifFlag: false, // Flag to trigger verification against GitHub

    action: null, // Action to be performed

    agileLabels: [], // Agile labels available to the issue
    agileNewState: "", //

    showImportIssues: false,
    createFlag: false
  },
  reducers: {
    setLoadFlag(state, payload) {
      return { ...state, loadFlag: payload };
    },
    setStageFlag(state, payload) {
      return { ...state, stageFlag: payload };
    },

    setIssues(state, payload) {
      return { ...state, issues: payload };
    },
    setVerifiedIssues(state, payload) {
      return { ...state, verifiedIssues: payload };
    },
    insVerifiedIssues(state, payload) {
      let newArray = state.verifiedIssues.slice();
      newArray.splice(newArray.length, 0, payload);
      return { ...state, verifiedIssues: newArray };
    },
    setVerifFlag(state, payload) {
      return { ...state, verifFlag: payload };
    },

    setAction(state, payload) {
      return { ...state, action: payload };
    },
    setAgileLabels(state, payload) {
      return { ...state, agileLabels: payload };
    },
    setAgileNewState(state, payload) {
      return { ...state, agileNewState: payload };
    },

    setShowImportIssues(state, payload) {
      return { ...state, showImportIssues: payload };
    }
  },

  effects: {
    async loadTsv(results) {
      if (results.data.length > 0) {
        this.setIssues(
          results.data.map(issue => {
            return { ...issue, id: uuidv1() };
          })
        );
        this.setAction("create");
        this.setVerifFlag(true);
        this.setStageFlag(true);
        this.setShowImportIssues(false);
      }
    }
  }
};
