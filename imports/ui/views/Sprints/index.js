import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import VelocityWeeks from '../../components/Cards/VelocityWeeks/index.js';

import DaysToCompletion from './DaysToCompletion/index.js';

import StatsBar from './StatsBar/index.js';
import Assignees from './Assignees/index.js';
import Repositories from './Repositories/index.js';
import Labels from './Labels/index.js';
import Issues from './Issues/index.js';
import Actions from './Actions/index.js';
import Summary from './Summary/index.js';
import RemainingPoints from './RemainingPoints/index.js';

import CurrentCompletion from './CurrentCompletion/index.js';

import CreateSprint from './CreateSprint/index.js';

import IssuesFetch from '../../data/Issues/Fetch/index.js';
import IssuesEdit from '../../data/Issues/Edit/index.js';

import MilestonesEdit from '../../data/Milestones/Edit/index.js';

import ErrorBoundary from '../../ErrorBoundary.js';

const styles = theme => ({
    root: {
    }
});

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
        const { classes, issues, labels, velocity, assignees } = this.props;
        return (
            <div className={classes.root}>
                <General>
                    <IssuesFetch />
                    <IssuesEdit />
                    <CreateSprint />
                    <MilestonesEdit />
                    <Actions />
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm={6} md={8}>
                            <Summary />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <RemainingPoints
                                assignees={assignees}
                                issues={issues}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm={6} md={4}>
                            <CurrentCompletion
                                issues={issues}
                                labels={labels}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <VelocityWeeks
                                velocity={velocity}
                                defaultPoints={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <DaysToCompletion />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm={12} md={12}>
                            <Issues />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm={6} md={4}>
                            <Assignees />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Repositories />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Labels />
                        </Grid>
                    </Grid>
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

export default connect(mapState, null)(withRouter(withStyles(styles)(Sprints)));
