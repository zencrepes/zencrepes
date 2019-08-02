export default {
  state: {
    loadedIssues: null,
    loadedPullrequests: null,
    loadedSources: null,
    loadedLabels: null,
    loadedQueries: null,
    loadedMilestones: null,
    loadedProjects: null,
    loadedRepositories: null
  },
  reducers: {
    setLoadedIssues(state, payload) {
      return { ...state, loadedIssues: payload };
    },
    setLoadedPullrequests(state, payload) {
      return { ...state, loadedPullrequests: payload };
    },
    setLoadedSources(state, payload) {
      return { ...state, loadedSources: payload };
    },
    setLoadedLabels(state, payload) {
      return { ...state, loadedLabels: payload };
    },
    setLoadedQueries(state, payload) {
      return { ...state, loadedQueries: payload };
    },
    setLoadedMilestones(state, payload) {
      return { ...state, loadedMilestones: payload };
    },
    setLoadedProjects(state, payload) {
      return { ...state, loadedProjects: payload };
    },
    setLoadedRepositories(state, payload) {
      return { ...state, loadedRepositories: payload };
    }
  },

  effects: {}
};
