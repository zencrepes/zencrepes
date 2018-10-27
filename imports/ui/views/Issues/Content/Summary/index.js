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
        width: '100%',
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
        const { refreshSummary, shouldSummaryDataReload, refreshVelocity, shouldVelocityDataReload,  } = this.props;
        if (shouldSummaryDataReload === true) {
            refreshSummary();
        }
        if (shouldVelocityDataReload === true) {
            refreshVelocity();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { refreshSummary, shouldSummaryDataReload, refreshVelocity, shouldVelocityDataReload,  } = this.props;
        if (prevProps.shouldSummaryDataReload === false && shouldSummaryDataReload === true) {
            refreshSummary();
        }
        if (prevProps.shouldVelocityDataReload === false && shouldVelocityDataReload === true) {
            refreshVelocity();
        }
    }


    render() {
        const { classes, remainingWorkRepos, defaultPoints, remainingWorkPoints, remainingWorkCount, velocity } = this.props;

        console.log('++++++++++++');
        console.log(defaultPoints);
        console.log(remainingWorkRepos);
        console.log(remainingWorkPoints);
        console.log(remainingWorkCount);
        console.log(velocity);
        console.log('++++++++++++');

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
                        {velocity !== {} &&
                            <DaysToCompletion
                                velocity={velocity}
                                defaultPoints={defaultPoints}
                            />
                        }
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        {velocity !== {} &&
                            <VelocityDays
                                velocity={velocity}
                                defaultPoints={defaultPoints}
                            />
                        }
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        {velocity !== {} &&
                            <VelocityWeeks
                                velocity={velocity}
                                defaultPoints={defaultPoints}
                            />
                        }
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
    shouldVelocityDataReload: state.issuesView.shouldVelocityDataReload,

    remainingWorkRepos: state.issuesView.remainingWorkRepos,
    remainingWorkPoints: state.issuesView.remainingWorkPoints,
    remainingWorkCount: state.issuesView.remainingWorkCount,

    velocity: state.issuesView.velocity,

    defaultPoints: state.issuesView.defaultPoints,
});

const mapDispatch = dispatch => ({
    refreshSummary: dispatch.issuesView.refreshSummary,
    refreshVelocity: dispatch.issuesView.refreshVelocity

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Summary));
