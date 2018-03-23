import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';

//import Header from './Header';
//import Table from './Table';
import Layout from './Layout';
import Reboot from 'material-ui/Reboot';
import Drawer from './drawer/Drawer';

import dailyTicketsStore from "../store/index";
import weeklyTicketsStore from "../store/index";

import { addDailyIssueCount,
    addClosedIssuesDay,
    addWeeklyClosedIssueCount,
    addWeeklyOpenedIssueCount,
    addDayVelocityClosed,
    addDayVelocityCreated,
    addWeekVelocityClosed,
    addWeekVelocityCreated } from "../actions/index";

window.dailyTicketsStore = dailyTicketsStore;
window.addDailyIssueCount = addDailyIssueCount;
window.addClosedIssuesDay = addClosedIssuesDay;
window.addDayVelocityClosed = addDayVelocityClosed;
window.addDayVelocityCreated = addDayVelocityCreated;

window.weeklyTicketsStore = weeklyTicketsStore;
window.addWeeklyOpenedIssueCount = addWeeklyOpenedIssueCount;
window.addWeeklyClosedIssueCount = addWeeklyClosedIssueCount;
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
