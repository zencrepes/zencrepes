export default {
  state: {
    steps: ["Welcome !", "API Configuration", "Repositories", "Be Agile !"],
    activeStep: 0
  },
  reducers: {
    setActiveStep(state, payload) {
      return { ...state, activeStep: payload };
    },
    setReposIssues(state, payload) {
      return { ...state, reposIssues: payload };
    }
  },
  effects: {
    changeActiveStep(payload) {
      this.setActiveStep(payload);
    }
  }
};
