// src/js/reducers/index.js
import { ADD_DAY } from "../constants/action-types";
import { ADD_CLOSED_ISSUES_DAY } from "../constants/action-types";

const initialState = {
    dailyIssuesCount: [],
    closedIssuesDays: []
};
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DAY:
            return { ...state, dailyIssuesCount: [...state.dailyIssuesCount, action.payload] };
        case ADD_CLOSED_ISSUES_DAY:
            return { ...state, closedIssuesDays: [...state.closedIssuesDays, action.payload] };
        default:
            return state;
    }
};
export default rootReducer;