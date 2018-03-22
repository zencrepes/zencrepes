// src/js/actions/index.js
import { ADD_DAY } from "../constants/action-types";
import { ADD_CLOSED_ISSUES_DAY } from "../constants/action-types";
import { ADD_DAY_VELOCITY_CREATED } from "../constants/action-types";
import { ADD_DAY_VELOCITY_CLOSED } from "../constants/action-types";

export const addDailyIssueCount = dailyIssueCount => ({ type: "ADD_DAY", payload: dailyIssueCount });
export const addClosedIssuesDay = closedIssuesDay => ({ type: "ADD_CLOSED_ISSUES_DAY", payload: closedIssuesDay });
export const addDayVelocityCreated = dayVelocityCreated => ({ type: "ADD_DAY_VELOCITY_CREATED", payload: dayVelocityCreated });
export const addDayVelocityClosed = dayVelocityClosed => ({ type: "ADD_DAY_VELOCITY_CLOSED", payload: dayVelocityClosed });


import { ADD_OPENED_ISSUES_WEEK } from "../constants/action-types";
import { ADD_CLOSED_ISSUES_WEEK } from "../constants/action-types";
import { ADD_WEEK_VELOCITY_CREATED } from "../constants/action-types";
import { ADD_WEEK_VELOCITY_CLOSED } from "../constants/action-types";

export const addWeeklyOpenedIssueCount = weeklyOpenedIssueCount => ({ type: "ADD_OPENED_ISSUES_WEEK", payload: weeklyOpenedIssueCount });
export const addWeeklyClosedIssueCount = weeklyClosedIssueCount => ({ type: "ADD_CLOSED_ISSUES_WEEK", payload: weeklyClosedIssueCount });
export const addWeekVelocityCreated = weekVelocityCreated => ({ type: "ADD_WEEK_VELOCITY_CREATED", payload: weekVelocityCreated });
export const addWeekVelocityClosed = weekVelocityClosed => ({ type: "ADD_WEEK_VELOCITY_CLOSED", payload: weekVelocityClosed });