// src/js/actions/index.js
import { ADD_DAY } from "../constants/action-types";
import { ADD_CLOSED_ISSUES_DAY } from "../constants/action-types";

export const addDailyIssueCount = dailyIssueCount => ({ type: "ADD_DAY", payload: dailyIssueCount });
export const addClosedIssuesDay = closedIssuesDay => ({ type: "ADD_CLOSED_ISSUES_DAY", payload: closedIssuesDay });