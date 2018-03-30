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

import { ADD_FACET_STATE } from "../constants/action-types";
import { ADD_FACET_AUTHOR } from "../constants/action-types";
import { ADD_FACET_ASSIGNEE } from "../constants/action-types";
import { ADD_FACET_ORGANIZATION } from "../constants/action-types";
import { ADD_FACET_REPOSITORY } from "../constants/action-types";
import { ADD_FACET_MILESTONE } from "../constants/action-types";
import { ADD_FACET_MILESTONE_STATE } from "../constants/action-types";
import { ADD_FACET_LABEL } from "../constants/action-types";

export const addFacetState = facetState => ({ type: "ADD_FACET_STATE", payload: facetState });
export const addFacetAuthor = facetAuthor => ({ type: "ADD_FACET_AUTHOR", payload: facetAuthor });
export const addFacetAssignee = facetAssignee => ({ type: "ADD_FACET_ASSIGNEE", payload: facetAssignee });
export const addFacetOrganization = facetOrganization => ({ type: "ADD_FACET_ORGANIZATION", payload: facetOrganization });
export const addFacetRepository = facetRepository => ({ type: "ADD_FACET_REPOSITORY", payload: facetRepository });
export const addFacetMilestone = facetMilestone => ({ type: "ADD_FACET_MILESTONE", payload: facetMilestone });
export const addFacetMilestoneState = facetMilestoneState => ({ type: "ADD_FACET_MILESTONE_STATE", payload: facetMilestoneState });
export const addFacetLabel = facetLabel => ({ type: "ADD_FACET_LABEL", payload: facetLabel });
