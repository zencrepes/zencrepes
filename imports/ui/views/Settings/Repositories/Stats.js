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
            issuesCountLoaded,
            labelsCountTotal,
            labelsCountSelected,
            labelsCountLoaded,
            milestonesCountTotal,
            milestonesCountSelected,
            milestonesCountLoaded,
        } = this.props;

        /*
                    Organization
                    {orgCountSelected} / {orgCountTotal}

         */

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
                <Grid item xs={12} sm container className={classes.blank}>

                </Grid>
            </Grid>
            </React.Fragment>
        );
    }
}

Stats.propTypes = {
//    classes: PropTypes.object.isRequired,
//    loading: PropTypes.bool.isRequired,

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
    milestonesCountTotal: state.settingsView.milestonesCountTotal,
    milestonesCountSelected: state.settingsView.milestonesCountSelected,
    milestonesCountLoaded: state.settingsView.milestonesCountLoaded,
});

export default connect(mapState, null)(withStyles(styles)(Stats));