import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Paper from '@material-ui/core/Paper';
import uuidv1 from "uuid/v1";

import HighchartsVelocity from './HighchartsVelocity.js';

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


class Velocity extends Component {
    constructor (props) {
        super(props);
    }

    componentDidMount(prevProps, prevState, snapshot) {
        const { refreshVelocity, shouldVelocityDataReload, velocity } = this.props;
        console.log('Velocity - componentDidMount');
        if (shouldVelocityDataReload === true) {
            console.log('Velocity - componentDidMount - Trigger initFacets');
            refreshVelocity();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { refreshVelocity, shouldVelocityDataReload } = this.props;
        console.log('Velocity - componentDidUpdate');
        if (prevProps.shouldVelocityDataReload === false && shouldVelocityDataReload === true) {
            console.log('Velocity - componentDidUpdate - Trigger initFacets');
            refreshVelocity();
        }
    }

    prepareDataset() {
        const { velocity } = this.props;
        if (velocity['weeks'] !== undefined ) {
            return velocity['weeks'];
        } else {
            return [];
        }
    }

    getVelocityHighcharts(velocity) {
        let issuesCount = [];
        let storyPoints = [];
        velocity.forEach((v) => {
            issuesCount.push([new Date(v.weekStart).getTime(), Math.round(v.issues.velocity, 1)]);
            storyPoints.push([new Date(v.weekStart).getTime(), Math.round(v.points.velocity, 1)]);
        });
        if (issuesCount.length === 0) {
            return [];
        } else {
            return [
                {id: 'issues-' + uuidv1(), name: 'Issues', weeks: issuesCount},
                {id: 'points-' + uuidv1(), name: 'Story Points', weeks: storyPoints}
            ];
        }
    }

    render() {
        const { classes } = this.props;

        let dataset = this.prepareDataset();

        return (
            <Paper className={classes.root} elevation={1}>
                <HighchartsVelocity data={this.getVelocityHighcharts(dataset)} />
            </Paper>
        );
    }
}

Velocity.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    shouldVelocityDataReload: state.issuesView.shouldVelocityDataReload,
    velocity: state.issuesView.velocity,
});

const mapDispatch = dispatch => ({
    refreshVelocity: dispatch.issuesView.refreshVelocity,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Velocity));
