// src/js/actions/index.js
import { ADD_DAY } from "../constants/action-types";

export const addDailyIssueCount = dailyIssueCount => ({ type: "ADD_DAY", payload: dailyIssueCount });
