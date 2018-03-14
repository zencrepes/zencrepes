import { createStore } from "redux";
import rootReducer from "../reducers/index";

const dailyIssuesCountStore = createStore(rootReducer);

export default dailyIssuesCountStore;
