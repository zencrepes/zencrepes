// src/js/reducers/index.js
import {
    ADD_DAY,
    ADD_CLOSED_ISSUES_DAY,
    ADD_CLOSED_ISSUES_WEEK,
    ADD_OPENED_ISSUES_WEEK,
    ADD_DAY_VELOCITY_CLOSED,
    ADD_DAY_VELOCITY_CREATED,
    ADD_WEEK_VELOCITY_CLOSED,
    ADD_WEEK_VELOCITY_CREATED} from "../constants/action-types";

const initialState = {
    dailyIssuesCount: [],
    closedIssuesDays: [],
    weeklyOpenedIssueCount: [],
    weeklyClosedIssueCount: [],
    dayVelocityCreated: [],
    dayVelocityClosed: [],
    weekVelocityCreated: [],
    weekVelocityClosed: []
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
        case ADD_DAY_VELOCITY_CREATED:
            return { ...state, dayVelocityCreated: [...state.dayVelocityCreated, action.payload] };
        case ADD_DAY_VELOCITY_CLOSED:
            return { ...state, dayVelocityClosed: [...state.dayVelocityClosed, action.payload] };
        case ADD_WEEK_VELOCITY_CREATED:
            return { ...state, weekVelocityCreated: [...state.weekVelocityCreated, action.payload] };
        case ADD_WEEK_VELOCITY_CLOSED:
            return { ...state, weekVelocityClosed: [...state.weekVelocityClosed, action.payload] };
        default:
            return state;
    }
};
export default rootReducer;

