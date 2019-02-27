import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid/Grid";
import StatsCharts from './StatsCharts/index.js';

const styles = {
    root: {
        flexGrow: 1,
        margin: '10px',
    },
    listItem: {
        padding: '0px',
    },
    actionButtons: {
        textAlign: 'right',
    },
    loading: {
        flexGrow: 1,
    },
    pieHeight: {
        height: '150px',
        width: '150px',
    },
};

class Stats extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            classes,
            selectedRepos,
            availableRepos,
            orgCountTotal,
            orgCountSelected,
            issuesCountTotal,
            issuesCountSelected,
            labelsCountTotal,
            labelsCountSelected,
            projectsCountTotal,
            projectsCountSelected,
            milestonesCountTotal,
            milestonesCountSelected,
        } = this.props;

        return (
            <React.Fragment>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={8}
            >
                <Grid item xs={12} sm container className={classes.blank}>

                </Grid>
                <Grid item className={classes.pieHeight}>
                    <StatsCharts
                        selected={orgCountSelected}
                        total={orgCountTotal}
                        title="Orgs"
                    />
                </Grid>
                <Grid item className={classes.pieHeight}>
                    <StatsCharts
                        selected={selectedRepos.length}
                        total={availableRepos.length}
                        title="Repos"
                    />
                </Grid>
                <Grid item className={classes.pieHeight}>
                    <StatsCharts
                        selected={issuesCountSelected}
                        total={issuesCountTotal}
                        title="Issues"
                    />
                </Grid>
                <Grid item className={classes.pieHeight}>
                    <StatsCharts
                        selected={milestonesCountSelected}
                        total={milestonesCountTotal}
                        title="Milestones"
                    />
                </Grid>
                <Grid item className={classes.pieHeight}>
                    <StatsCharts
                        selected={labelsCountSelected}
                        total={labelsCountTotal}
                        title="Labels"
                    />
                </Grid>
                <Grid item className={classes.pieHeight}>
                    <StatsCharts
                        selected={projectsCountSelected}
                        total={projectsCountTotal}
                        title="Projects"
                    />
                </Grid>
                <Grid item xs={12} sm container className={classes.blank}>

                </Grid>
            </Grid>
            </React.Fragment>
        );
    }
}

Stats.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedRepos: PropTypes.array.isRequired,
    availableRepos: PropTypes.array.isRequired,

    orgCountTotal: PropTypes.number.isRequired,
    orgCountSelected: PropTypes.number.isRequired,
    issuesCountTotal: PropTypes.number.isRequired,
    issuesCountSelected: PropTypes.number.isRequired,
    issuesCountLoaded: PropTypes.number.isRequired,
    labelsCountTotal: PropTypes.number.isRequired,
    labelsCountSelected: PropTypes.number.isRequired,
    labelsCountLoaded: PropTypes.number.isRequired,
    projectsCountTotal: PropTypes.number.isRequired,
    projectsCountSelected: PropTypes.number.isRequired,
    projectsCountLoaded: PropTypes.number.isRequired,
    milestonesCountTotal: PropTypes.number.isRequired,
    milestonesCountSelected: PropTypes.number.isRequired,
    milestonesCountLoaded: PropTypes.number.isRequired,
};

const mapState = state => ({
    selectedRepos: state.settingsView.selectedRepos,
    availableRepos: state.settingsView.availableRepos,
    orgCountTotal: state.settingsView.orgCountTotal,
    orgCountSelected: state.settingsView.orgCountSelected,
    issuesCountTotal: state.settingsView.issuesCountTotal,
    issuesCountSelected: state.settingsView.issuesCountSelected,
    issuesCountLoaded: state.settingsView.issuesCountLoaded,
    labelsCountTotal: state.settingsView.labelsCountTotal,
    labelsCountSelected: state.settingsView.labelsCountSelected,
    labelsCountLoaded: state.settingsView.labelsCountLoaded,
    projectsCountTotal: state.settingsView.projectsCountTotal,
    projectsCountSelected: state.settingsView.projectsCountSelected,
    projectsCountLoaded: state.settingsView.projectsCountLoaded,
    milestonesCountTotal: state.settingsView.milestonesCountTotal,
    milestonesCountSelected: state.settingsView.milestonesCountSelected,
    milestonesCountLoaded: state.settingsView.milestonesCountLoaded,
});

export default connect(mapState, null)(withStyles(styles)(Stats));