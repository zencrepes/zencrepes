import React, { Component } from 'react';
import { gh_issues } from '../data_fetch/LoadIssues.js'
import {gh_organizations} from "../data_fetch/LoadOrgs";

export const stats_issues_per_day = new Mongo.Collection('stats_issues_per_day', {connection: null});

const formatDate = (dateString) => {
    day = new Date(dateString);
    day.setUTCHours(0);
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    return day
}

// Build a collection of days between 2 dates
const buildCollectionInterval = (startDate, endDate) => {
    let currentDate = startDate;
    while(currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        stats_issues_per_day.insert({
            date: currentDate,
            createdCount: 0,
            closedCount: 0,
        });
    }
}

//Very basic non-optimized initial implementation
const DailyStats = () => {

    // Start by clearing the cache
    stats_issues_per_day.remove({});

    // Define first and last date
    let firstDay = formatDate(gh_issues.findOne({}, { sort: { createdAt: 1 }, reactive: false, transform: null }).createdAt);
    let lastDay = formatDate(gh_issues.findOne({}, { sort: { createdAt: -1 }, reactive: false, transform: null }).updatedAt);

    console.log("First Day: " + firstDay.toISOString() + " - Last Day: " + lastDay.toISOString());

    // Build a collection of all possible dates between the above two dates
    buildCollectionInterval(firstDay, lastDay);
    console.log("Number of days in the interval: " + stats_issues_per_day.find({}).count({}));

    //Loop through all issues and add count to the stats_issues_per_day
    gh_issues.find({}).forEach((issue) => {
        stats_issues_per_day.update({date: formatDate(issue.createdAt)}, {
            $inc: { createdCount: 1 }
        });
        stats_issues_per_day.update({date: formatDate(issue.closedAt)}, {
            $inc: { closedCount: 1 }
        });
    });

    console.log("Done");
/*
    stats_issues_per_day.find({}).forEach((day) => {
        console.log("Date: " + day.date + " - Created: " + day.createdCount + ' - Closed: ' + day.closedCount);
    });
*/
    //
    /*
    //Looping through all tickets by last update date, descending
    gh_issues.find({}, { sort: { updatedAt: -1 }, reactive: false, transform: null }).forEach((issue) => {
        // If the collection is empty, create the first record
        if (nextDate === null){

            startDay = formatDate(issue.updatedAt);

            stats_issues_per_day.insert({
                day: startDay,
                created_count: 0,
                updated_count: 0,
                closed_count: 0,
            });
        }
        nextIssue =

    });
    console.log("First day: " + startDay.toISOString() + ' Count: ' + stats_issues_per_day.find({}).count());
    */
/*
    console.log(gh_issues);
    let firstCreatedIssue = gh_issues.findOne({}, { sort: { createdAt: 1 }, reactive: false, transform: null });
    console.log(firstCreatedIssue);
    let lastCreatedIssue = gh_issues.findOne({}, { sort: { createdAt: -1 }, reactive: false, transform: null });
    console.log(lastCreatedIssue);
    console.log("---");
    console.log(gh_issues.find({}, { sort: { createdAt: 1 }, reactive: false, transform: null }));
    console.log(gh_issues.find({}, { sort: { createdAt: -1 }, reactive: false, transform: null }));
    console.log("---");

    let firstClosedIssue = gh_issues.findOne({}, { sort: { closedAt: 'asc' }, reactive: false, transform: null });
    let lastClosedIssue = gh_issues.findOne({}, { sort: { closedAt: 'desc' }, reactive: false, transform: null });

    let firstUpdatedIssue = gh_issues.findOne({}, { sort: { updatedAt: 'asc' }, reactive: false, transform: null });
    let lastUpdatedIssue = gh_issues.findOne({}, { sort: { updatedAt: 'desc' }, reactive: false, transform: null });

    console.log("createdAt - First: " + firstCreatedIssue.title + "(" + firstCreatedIssue.createdAt + ")" + " - Last: " + lastCreatedIssue.title + "(" + lastCreatedIssue.createdAt + ")")
    console.log("closedAt - First: " + firstClosedIssue.title + "(" + firstClosedIssue.createdAt + ")" + " - Last: " + lastClosedIssue.title + "(" + lastClosedIssue.createdAt + ")")
    console.log("updatedAt - First: " + firstUpdatedIssue.title + "(" + firstUpdatedIssue.createdAt + ")" + " - Last: " + lastUpdatedIssue.title + "(" + lastUpdatedIssue.createdAt + ")")
*/
}

export default DailyStats;