import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Paper from '@material-ui/core/Paper';
import uuidv1 from "uuid/v1";

import VelocityChart from './Chart.js';

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
        let pullrequestsCount = [];
        let storyPoints = [];
        velocity.forEach((v) => {
            pullrequestsCount.push([new Date(v.weekStart).getTime(), Math.round(v.completion.issues.velocity, 1)]);
            storyPoints.push([new Date(v.weekStart).getTime(), Math.round(v.completion.points.velocity, 1)]);
        });
        if (pullrequestsCount.length === 0) {
            return [];
        } else {
            return [
                {id: 'pullrequests-' + uuidv1(), name: 'Pullrequests', weeks: pullrequestsCount},
                {id: 'points-' + uuidv1(), name: 'Story Points', weeks: storyPoints}
            ];
        }
    }

    render() {
        let dataset = this.prepareDataset();

        return (
            <Paper elevation={1}>
                <VelocityChart data={this.getVelocityHighcharts(dataset)} />
            </Paper>
        );
    }
}

Velocity.propTypes = {
    velocity: PropTypes.object.isRequired,
};

const mapState = state => ({
    velocity: state.pullrequestsView.velocity,
});

export default connect(mapState, null)(Velocity);
