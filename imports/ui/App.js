import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';

//import Header from './Header';
//import Table from './Table';
import Layout from './Layout';
import Reboot from 'material-ui/Reboot';
import Drawer from './drawer/Drawer';

import dailyTicketsStore from "../store/index";
import weeklyTicketsStore from "../store/index";
import stateStore from "../store/index";

import { addDayCreated,
    addDayClosed,
    addWeekClosed,
    addWeekCreated,
    addDayVelocityClosed,
    addDayVelocityCreated,
    addWeekVelocityClosed,
    addWeekVelocityCreated,
    addCompletionEstimate,
    addFacetState,
    addFacetAuthor,
    addFacetAssignee,
    addFacetOrganization,
    addFacetRepository,
    addFacetMilestone,
    addFacetMilestoneState,
    addFacetLabel,
    } from "../actions/index";

window.dailyTicketsStore = dailyTicketsStore;
window.addDayCreated = addDayCreated;
window.addDayClosed = addDayClosed;
window.addDayVelocityClosed = addDayVelocityClosed;
window.addDayVelocityCreated = addDayVelocityCreated;

window.weeklyTicketsStore = weeklyTicketsStore;
window.addWeekCreated = addWeekCreated;
window.addWeekClosed = addWeekClosed;
window.addWeekVelocityClosed = addWeekVelocityClosed;
window.addWeekVelocityCreated = addWeekVelocityCreated;
window.addCompletionEstimate = addCompletionEstimate;

window.stateStore = stateStore;
window.addFacetState = addFacetState;
window.addFacetAuthor = addFacetAuthor;
window.addFacetAssignee = addFacetAssignee;
window.addFacetOrganization = addFacetOrganization;
window.addFacetRepository = addFacetRepository;
window.addFacetMilestone = addFacetMilestone;
window.addFacetMilestoneState = addFacetMilestoneState;
window.addFacetLabel = addFacetLabel;

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
