// src/js/actions/index.js
import { ADD_DAY_CREATED } from "../constants/action-types";
import { ADD_DAY_CLOSED } from "../constants/action-types";
import { ADD_DAY_VELOCITY_CREATED } from "../constants/action-types";
import { ADD_DAY_VELOCITY_CLOSED } from "../constants/action-types";

export const addDayCreated = dayCreated => ({ type: "ADD_DAY_CREATED", payload: dayCreated });
export const addDayClosed = dayClosed => ({ type: "ADD_DAY_CLOSED", payload: dayClosed });
export const addDayVelocityCreated = dayVelocityCreated => ({ type: "ADD_DAY_VELOCITY_CREATED", payload: dayVelocityCreated });
export const addDayVelocityClosed = dayVelocityClosed => ({ type: "ADD_DAY_VELOCITY_CLOSED", payload: dayVelocityClosed });

import { ADD_WEEK_CREATED } from "../constants/action-types";
import { ADD_WEEK_CLOSED } from "../constants/action-types";
import { ADD_WEEK_VELOCITY_CREATED } from "../constants/action-types";
import { ADD_WEEK_VELOCITY_CLOSED } from "../constants/action-types";

export const addWeekCreated = weekCreated => ({ type: "ADD_WEEK_CREATED", payload: weekCreated });
export const addWeekClosed = weekClosed => ({ type: "ADD_WEEK_CLOSED", payload: weekClosed });
export const addWeekVelocityCreated = weekVelocityCreated => ({ type: "ADD_WEEK_VELOCITY_CREATED", payload: weekVelocityCreated });
export const addWeekVelocityClosed = weekVelocityClosed => ({ type: "ADD_WEEK_VELOCITY_CLOSED", payload: weekVelocityClosed });

import { ADD_COMPLETION_ESTIMATE } from "../constants/action-types";
export const addCompletionEstimate = completionEstimate => ({ type: "ADD_COMPLETION_ESTIMATE", payload: completionEstimate });

