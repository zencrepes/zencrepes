import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';

//import Header from './Header';
//import Table from './Table';
import Layout from './Layout';
import Reboot from 'material-ui/Reboot';
import Drawer from './drawer/Drawer';


import dailyIssuesCountStore from "../store/index";
import { addDailyIssueCount } from "../actions/index";
window.dailyIssuesCountStore = dailyIssuesCountStore;
window.addDailyIssueCount = addDailyIssueCount;

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
