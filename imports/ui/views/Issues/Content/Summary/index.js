import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import DaysToCompletion from './DaysToCompletion/index.js';
import RemainingWork from './RemainingWork/index.js';
import VelocityDays from './VelocityDays/index.js';
import VelocityWeeks from './VelocityWeeks/index.js';

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class Summary extends Component {
    constructor (props) {
        super(props);
    }

    componentDidMount(prevProps, prevState, snapshot) {
        const { refreshSummary, shouldSummaryDataReload } = this.props;
        console.log('Burndown - componentDidMount');
        if (shouldSummaryDataReload === true) {
            console.log('Burndown - componentDidMount - Trigger initFacets');
            refreshSummary();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { refreshSummary, shouldSummaryDataReload } = this.props;
        console.log('Burndown - componentDidUpdate');
        if (prevProps.shouldSummaryDataReload === false && shouldSummaryDataReload === true) {
            console.log('Burndown - componentDidUpdate - Trigger initFacets');
            refreshSummary();
        }
    }


    render() {
        const { classes, remainingWorkRepos, defaultPoints, remainingWorkPoints, remainingWorkCount } = this.props;

        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        {remainingWorkRepos.length > 0 &&
                            <RemainingWork
                                defaultPoints={defaultPoints}
                                remainingWorkPoints={remainingWorkPoints}
                                remainingWorkRepos={remainingWorkRepos}
                                remainingWorkCount={remainingWorkCount}
                            />
                        }
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <DaysToCompletion />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <VelocityDays />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <VelocityWeeks />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Summary.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    facets: state.issuesView.facets,
    shouldSummaryDataReload: state.issuesView.shouldSummaryDataReload,

    remainingWorkRepos: state.issuesView.remainingWorkRepos,
    remainingWorkPoints: state.issuesView.remainingWorkPoints,
    remainingWorkCount: state.issuesView.remainingWorkCount,

    defaultPoints: state.issuesView.defaultPoints,


});

const mapDispatch = dispatch => ({
    refreshSummary: dispatch.issuesView.refreshSummary

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Summary));
