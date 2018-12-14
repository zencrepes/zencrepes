import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";

import Paper from '@material-ui/core/Paper';
import uuidv1 from "uuid/v1";

import BurndownChart from './Chart.js';

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


class Burndown extends Component {
    constructor (props) {
        super(props);
    }

    componentDidMount(prevProps, prevState, snapshot) {
        const { refreshBurndown, shouldBurndownDataReload, burndown } = this.props;
        console.log('Burndown - componentDidMount');
        if (shouldBurndownDataReload === true) {
            console.log('Burndown - componentDidMount - Trigger initFacets');
            refreshBurndown();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { refreshBurndown, shouldBurndownDataReload } = this.props;
        console.log('Burndown - componentDidUpdate');
        if (prevProps.shouldBurndownDataReload === false && shouldBurndownDataReload === true) {
            console.log('Burndown - componentDidUpdate - Trigger initFacets');
            refreshBurndown();
        }
    }

    getVelocityHighcharts() {
        const { burndown } = this.props;
        if (burndown.days !== undefined) {
            let issuesCount = [];
            let storyPoints = [];
            burndown.days.forEach((day) => {
                issuesCount.push([new Date(day.date).getTime(), day.count.remaining]);
                storyPoints.push([new Date(day.date).getTime(), day.points.remaining]);
            });
            if (issuesCount.length === 0) {
                return [];
            } else {
                return [
                    {id: 'issues-' + uuidv1(), name: 'Issues Count', days: issuesCount},
                    {id: 'points-' + uuidv1(), name: 'Story Points', days: storyPoints}
                ];
            }
        } else {
            return [];
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation={1}>
                <BurndownChart data={this.getVelocityHighcharts()} />
            </Paper>
        );
    }
}

Burndown.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    shouldBurndownDataReload: state.issuesView.shouldBurndownDataReload,
    burndown: state.issuesView.burndown,
});

const mapDispatch = dispatch => ({
    refreshBurndown: dispatch.issuesView.refreshBurndown,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Burndown));
