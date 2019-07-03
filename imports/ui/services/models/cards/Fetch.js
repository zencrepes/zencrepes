export default {
  state: {
    loadFlag: false, // Boolean to trigger cards load
    loadColumns: [] // Array of columns id
  },
  reducers: {
    setLoadFlag(state, payload) {
      return { ...state, loadFlag: payload };
    },
    setLoadColumns(state, payload) {
      return { ...state, loadColumns: payload };
    }
  },
  effects: {}
};
