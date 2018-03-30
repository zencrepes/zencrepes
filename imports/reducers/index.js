// src/js/reducers/index.js
import {
    ADD_DAY_CREATED,
    ADD_DAY_CLOSED,
    ADD_WEEK_CLOSED,
    ADD_WEEK_CREATED,
    ADD_DAY_VELOCITY_CLOSED,
    ADD_DAY_VELOCITY_CREATED,
    ADD_WEEK_VELOCITY_CLOSED,
    ADD_WEEK_VELOCITY_CREATED,
    ADD_COMPLETION_ESTIMATE,
    ADD_FACET_STATE,
    ADD_FACET_AUTHOR,
    ADD_FACET_ASSIGNEE,
    ADD_FACET_ORGANIZATION,
    ADD_FACET_REPOSITORY,
    ADD_FACET_MILESTONE,
    ADD_FACET_MILESTONE_STATE,
    ADD_FACET_LABEL,

    } from "../constants/action-types";

const initialState = {
    dayCreated: [],
    dayClosed: [],
    weekCreated: [],
    weekClosed: [],
    dayVelocityCreated: [],
    dayVelocityClosed: [],
    weekVelocityCreated: [],
    weekVelocityClosed: [],
    completionEstimate: [],
    facetState: [],
    facetAuthor: [],
    facetAssignee: [],
    facetOrganization: [],
    facetRepository: [],
    facetMilestone: [],
    facetMilestoneState: [],
    facetLabel: [],
};
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DAY_CREATED:
            return { ...state, dayCreated: [...state.dayCreated, action.payload] };
        case ADD_DAY_CLOSED:
            return { ...state, dayClosed: [...state.dayClosed, action.payload] };
        case ADD_WEEK_CREATED:
            return { ...state, weekCreated: [...state.weekCreated, action.payload] };
        case ADD_WEEK_CLOSED:
            return { ...state, weekClosed: [...state.weekClosed, action.payload] };
        case ADD_DAY_VELOCITY_CREATED:
            return { ...state, dayVelocityCreated: [...state.dayVelocityCreated, action.payload] };
        case ADD_DAY_VELOCITY_CLOSED:
            return { ...state, dayVelocityClosed: [...state.dayVelocityClosed, action.payload] };
        case ADD_WEEK_VELOCITY_CREATED:
            return { ...state, weekVelocityCreated: [...state.weekVelocityCreated, action.payload] };
        case ADD_WEEK_VELOCITY_CLOSED:
            return { ...state, weekVelocityClosed: [...state.weekVelocityClosed, action.payload] };
        case ADD_COMPLETION_ESTIMATE:
            return { ...state, completionEstimate: [...state.completionEstimate, action.payload] };
        case ADD_FACET_STATE:
            return { ...state, facetState: [...state.facetState, action.payload] };
        case ADD_FACET_AUTHOR:
            return { ...state, facetAuthor: [...state.facetAuthor, action.payload] };
        case ADD_FACET_ASSIGNEE:
            return { ...state, facetAssignee: [...state.facetAssignee, action.payload] };
        case ADD_FACET_ORGANIZATION:
            return { ...state, facetOrganization: [...state.facetOrganization, action.payload] };
        case ADD_FACET_REPOSITORY:
            return { ...state, facetRepository: [...state.facetRepository, action.payload] };
        case ADD_FACET_MILESTONE:
            return { ...state, facetMilestone: [...state.facetMilestone, action.payload] };
        case ADD_FACET_MILESTONE_STATE:
            return { ...state, facetMilestoneState: [...state.facetMilestoneState, action.payload] };
        case ADD_FACET_LABEL:
            return { ...state, facetLabel: [...state.facetLabel, action.payload] };
        default:
            return state;
    }
};
export default rootReducer;
