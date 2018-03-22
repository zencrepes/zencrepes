import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';

//import Header from './Header';
//import Table from './Table';
import Layout from './Layout';
import Reboot from 'material-ui/Reboot';
import Drawer from './drawer/Drawer';

import dailyIssuesCountStore from "../store/index";
import weeklyIssuesCountStore from "../store/index";
import dailyVelocityStore from "../store/index";
import weeklyVelocityStore from "../store/index";
import { addDailyIssueCount,
    addClosedIssuesDay,
    addWeeklyClosedIssueCount,
    addWeeklyOpenedIssueCount,
    addDayVelocityClosed,
    addDayVelocityCreated,
    addWeekVelocityClosed,
    addWeekVelocityCreated } from "../actions/index";

window.dailyIssuesCountStore = dailyIssuesCountStore;
window.addDailyIssueCount = addDailyIssueCount;
window.addClosedIssuesDay = addClosedIssuesDay;

window.weeklyIssuesCountStore = weeklyIssuesCountStore;
window.addWeeklyOpenedIssueCount = addWeeklyOpenedIssueCount;
window.addWeeklyClosedIssueCount = addWeeklyClosedIssueCount;

window.dailyVelocityStore = dailyVelocityStore;
window.addDayVelocityClosed = addDayVelocityClosed;
window.addDayVelocityCreated = addDayVelocityCreated;

window.weeklyVelocityStore = weeklyVelocityStore;
window.addWeekVelocityClosed = addWeekVelocityClosed;
window.addWeekVelocityCreated = addWeekVelocityCreated;

/*
export default class App extends Component {
    render() {
        return (
            <div className="container">
                <Reboot />

                <Header />
                <Table />
            </div>
        );
    }
}
*/

export default class App extends Component {
    render() {
        return (
            <div className="container">
                <Reboot />
                <Drawer />
                <Layout />
            </div>
        );
    }
}
