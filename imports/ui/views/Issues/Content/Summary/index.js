import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import DaysToCompletion from './DaysToCompletion/index.js';
import RemainingWork from './RemainingWork/index.js';
//import VelocityDays from './VelocityDays/index.js';
//import VelocityWeeks from './VelocityWeeks/index.js';

import VelocityWeeks from '../../../../components/Cards/VelocityWeeks/index.js';
import VelocityDays from '../../../../components/Cards/VelocityDays/index.js';

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

    render() {
        const { classes, remainingWorkRepos, defaultPoints, remainingWorkPoints, remainingWorkCount, velocity } = this.props;

        /*
        console.log('++++++++++++');
        console.log(defaultPoints);
        console.log(remainingWorkRepos);
        console.log(remainingWorkPoints);
        console.log(remainingWorkCount);
        console.log(velocity);
        console.log('++++++++++++');
        */

        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
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
                    spacing={8}
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
    defaultPoints: state.issuesView.defaultPoints,

    facets: state.issuesView.facets,

    remainingWorkRepos: state.issuesView.remainingWorkRepos,
    remainingWorkPoints: state.issuesView.remainingWorkPoints,
    remainingWorkCount: state.issuesView.remainingWorkCount,

    velocity: state.issuesView.velocity,

    query: state.issuesView.query,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Summary));
