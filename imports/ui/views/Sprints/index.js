import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import General from '../../layouts/General/index.js';

import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';

//import OverallVelocityWeeks from './OverallVelocityWeeks/index.js';
//import DataLoader from './DataLoader.js';
//import VelocityWeeks from './VelocityWeeks/index.js';
import VelocityWeeks from '../../components/Cards/VelocityWeeks/index.js';

import DaysToCompletion from './DaysToCompletion/index.js';

import StatsBar from './StatsBar/index.js';
import ViewToolbar from './ViewToolbar/index.js';
import Assignees from './Assignees/index.js';
import Repositories from './Repositories/index.js';
import Labels from './Labels/index.js';
import Issues from './Issues/index.js';
import Actions from './Actions/index.js';

import CurrentCompletion from './CurrentCompletion/index.js';

import CreateSprint from './CreateSprint/index.js';
import CreateMilestones from '../../data/CreateMilestones.js';

import IssuesFetch from '../../data/Issues/Fetch/index.js';

import ErrorBoundary from '../../ErrorBoundary.js';

class Sprints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    render() {
        const { classes, issues, labels, velocity } = this.props;
        console.log(velocity);
        return (
            <div className={classes.root}>
                <General>
                    <IssuesFetch />
                    <CreateSprint />
                    <CreateMilestones />
                    <Actions />
                    <GridContainer>
                        <GridItem xs={12} sm={6} md={4}>
                            <ErrorBoundary>
                                <CurrentCompletion
                                    issues={issues}
                                    labels={labels}
                                />
                            </ErrorBoundary>
                        </GridItem>
                        <GridItem xs={12} sm={6} md={4}>
                            <VelocityWeeks
                                velocity={velocity}
                                defaultPoints={true}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={4}>
                            <DaysToCompletion/>
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={6} md={12}>
                            <Issues />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={6} md={4}>
                            <Assignees />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={4}>
                            <Repositories />
                        </GridItem>
                        <GridItem xs={12} sm={6} md={4}>
                            <Labels />
                        </GridItem>
                    </GridContainer>
                </General>
            </div>
        );
    }
}

Sprints.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    repositories: state.sprintsView.repositories,
    assignees: state.sprintsView.assignees,
    issues: state.sprintsView.issues,
    velocity: state.sprintsView.velocity,
});

export default connect(mapState, null)(withRouter(withStyles(dashboardStyle)(Sprints)));
