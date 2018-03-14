// src/js/reducers/index.js
import { ADD_DAY } from "../constants/action-types";
const initialState = {
    dailyIssuesCount: []
};
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DAY:
            return { ...state, articles: [...state.articles, action.payload] };
        default:
            return state;
    }
};
export default rootReducer;