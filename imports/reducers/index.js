// src/js/reducers/index.js
import {
    ADD_DAY_CREATED,
    ADD_DAY_CLOSED,
    ADD_WEEK_CLOSED,
    ADD_WEEK_CREATED,
    ADD_DAY_VELOCITY_CLOSED,
    ADD_DAY_VELOCITY_CREATED,
    ADD_WEEK_VELOCITY_CLOSED,
    ADD_WEEK_VELOCITY_CREATED
    } from "../constants/action-types";

const initialState = {
    dayCreated: [],
    dayClosed: [],
    weekCreated: [],
    weekClosed: [],
    dayVelocityCreated: [],
    dayVelocityClosed: [],
    weekVelocityCreated: [],
    weekVelocityClosed: []
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
        default:
            return state;
    }
};
export default rootReducer;

