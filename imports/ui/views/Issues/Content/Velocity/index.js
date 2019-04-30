import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Paper from '@material-ui/core/Paper';
import uuidv1 from "uuid/v1";

import VelocityOverallChart from '../../../../components/Charts/Highcharts/VelocityOverallChart.js';

class Velocity extends Component {
    constructor (props) {
        super(props);
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
        let storyPointsWeek = [];
        velocity.forEach((v) => {
            issuesCount.push([new Date(v.weekStart).getTime(), Math.round(v.completion.issues.velocity, 1)]);
            storyPoints.push([new Date(v.weekStart).getTime(), Math.round(v.completion.points.velocity, 1)]);
            storyPointsWeek.push([new Date(v.weekStart).getTime(), Math.round(v.completion.points.count, 1)]);
        });
        if (issuesCount.length === 0) {
            return [];
        } else {
            return [
                {id: 'issues-' + uuidv1(), type: 'spline', name: 'Issues', weeks: issuesCount},
                {id: 'points-' + uuidv1(), type: 'spline', name: 'Story Points (Velocity)', weeks: storyPoints},
                {id: 'pointsWeek-' + uuidv1(), type: 'column', name: 'Story Points (Week)', weeks: storyPointsWeek}
            ];
        }
    }

    render() {
        let dataset = this.prepareDataset();

        return (
            <Paper elevation={1}>
                <VelocityOverallChart data={this.getVelocityHighcharts(dataset)} />
            </Paper>
        );
    }
}

Velocity.propTypes = {
    velocity: PropTypes.object.isRequired,
};

const mapState = state => ({
    velocity: state.issuesView.velocity,
});

export default connect(mapState, null)(Velocity);
