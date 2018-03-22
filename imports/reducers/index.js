// src/js/reducers/index.js
import {
    ADD_DAY,
    ADD_CLOSED_ISSUES_DAY,
    ADD_CLOSED_ISSUES_WEEK,
    ADD_OPENED_ISSUES_WEEK } from "../constants/action-types";

const initialState = {
    dailyIssuesCount: [],
    closedIssuesDays: [],
    weeklyOpenedIssueCount: [],
    weeklyClosedIssueCount: [],
};
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DAY:
            return { ...state, dailyIssuesCount: [...state.dailyIssuesCount, action.payload] };
        case ADD_CLOSED_ISSUES_DAY:
            return { ...state, closedIssuesDays: [...state.closedIssuesDays, action.payload] };
        case ADD_OPENED_ISSUES_WEEK:
            return { ...state, weeklyOpenedIssueCount: [...state.weeklyOpenedIssueCount, action.payload] };
        case ADD_CLOSED_ISSUES_WEEK:
            return { ...state, weeklyClosedIssueCount: [...state.weeklyClosedIssueCount, action.payload] };
        default:
            return state;
    }
};
export default rootReducer;

