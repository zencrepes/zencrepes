import React, { Component } from 'react';
import { gh_issues } from '../data_fetch/LoadIssues.js'
import {gh_organizations} from "../data_fetch/LoadOrgs";
import { connect } from "react-redux";
import {withHighcharts} from "react-jsx-highstock";
import Highcharts from "highcharts/highstock";


export const stats_issues_per_day = new Mongo.Collection('stats_issues_per_day', {connection: null});
export const gh_milestones = new Mongo.Collection('gh_milestones', {connection: null});

export let array_issues_per_day = [];
export let array_completion_per_week = [];

const formatDate = (dateString) => {
    day = new Date(dateString);
    day.setUTCHours(0);
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    return day
}

const getWeekYear = (dateObj) => {
    var jan4th = new Date(dateObj.getFullYear(),0,4);
    return Math.ceil((((dateObj - jan4th) / 86400000) + jan4th.getDay()+1)/7);
}

// Build a collection of days between 2 dates
const buildArrayInterval = (startDate, endDate) => {
    //let array_issues_per_day = [];
    var currentDate = startDate;
    while(currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        array_issues_per_day[currentDate.toJSON().slice(0, 10)] = {date: currentDate.toJSON(), createdCount: 0, closedCount: 0, createdPoints: 0, closedPoints:0}

        var currentWeekYear = currentDate.getFullYear()*100 + getWeekYear(currentDate);
        if(typeof array_completion_per_week[currentWeekYear] === 'undefined') {
            array_completion_per_week[currentWeekYear] = {weekStart: currentDate.toJSON(), createdCount: 0, closedCount: 0, createdPoints: 0, closedPoints:0}
        }
    }
    return array_issues_per_day;
}

//Very basic non-optimized initial implementation
const DailyStats = () => {

    // Start by clearing the cache
//    stats_issues_per_day.remove({});

    // Define first and last date
    let firstDay = formatDate(gh_issues.findOne({}, { sort: { createdAt: 1 }, reactive: false, transform: null }).createdAt);
    let lastDay = formatDate(gh_issues.findOne({}, { sort: { createdAt: -1 }, reactive: false, transform: null }).updatedAt);

    //Small trick to avoid timezone issues, start the dates array one day earlier and end one day later
    firstDay.setDate(firstDay.getDate() - 1);
    lastDay.setDate(lastDay.getDate() + 1);
    console.log("First Day: " + firstDay.toDateString() + " - Last Day: " + lastDay.toDateString());

    // Trying to see if this is faster
    array_issues_per_day = buildArrayInterval(firstDay, lastDay);
    console.log("Number of days in the interval: " + Object.keys(array_issues_per_day).length);
    gh_issues.find({}).forEach((issue) => {

        // Populate daily stats array
        array_issues_per_day[issue.createdAt.slice(0, 10)]['createdCount']++;
        if (issue.closedAt !== null) {
            array_issues_per_day[issue.closedAt.slice(0, 10)]['closedCount']++;
        }

        // Populate weekly stats array
        createdDate = formatDate(formatDate(issue.createdAt));
        createdWeek = createdDate.getFullYear()*100 + getWeekYear(createdDate);
        array_completion_per_week[createdWeek]['createdCount']++;

        if (issue.closedAt !== null) {
            closedDate = formatDate(formatDate(issue.closedAt));
            closedWeek = closedDate.getFullYear()*100 + getWeekYear(closedDate);
            array_completion_per_week[createdWeek]['closedCount']++;
        }
    });

    // Processing is complete, fill redux store with daily data
    Object.keys(array_issues_per_day).forEach(function(key) {
        window.dailyIssuesCountStore.dispatch(window.addDailyIssueCount([
            new Date(array_issues_per_day[key].date).getTime(),
            array_issues_per_day[key]['createdCount']
        ]));
        window.dailyIssuesCountStore.dispatch(window.addClosedIssuesDay([
            new Date(array_issues_per_day[key].date).getTime(),
            array_issues_per_day[key]['closedCount']
        ]));
    });

    // Processing is complete, fill redux store with weekly data
    Object.keys(array_completion_per_week).forEach(function(key) {
        window.weeklyIssuesCountStore.dispatch(window.addWeeklyOpenedIssueCount([
            new Date(array_completion_per_week[key].weekStart).getTime(),
            array_completion_per_week[key]['createdCount']
        ]));
        window.weeklyIssuesCountStore.dispatch(window.addWeeklyClosedIssueCount([
            new Date(array_completion_per_week[key].weekStart).getTime(),
            array_completion_per_week[key]['closedCount']
        ]));
    });
}

/*
const List = connect(mapStateToProps)(ConnectedList);
export default List;
export default connect(mapStateToProps)(withHighcharts(StatsPerDay, Highcharts));
*/
export default DailyStats;
//export default connect(mapStateToProps)(DailyStats);