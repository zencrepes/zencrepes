import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Paper from '@material-ui/core/Paper';
import uuidv1 from "uuid/v1";

import BurndownChart from './Chart.js';

class Burndown extends Component {
    constructor (props) {
        super(props);
    }

    componentDidMount() {
        const { refreshBurndown, shouldBurndownDataReload } = this.props;
        if (shouldBurndownDataReload === true) {
            refreshBurndown();
        }
    }

    componentDidUpdate(prevProps) {
        const { refreshBurndown, shouldBurndownDataReload } = this.props;
        if (prevProps.shouldBurndownDataReload === false && shouldBurndownDataReload === true) {
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
        return (
            <Paper elevation={1}>
                <BurndownChart data={this.getVelocityHighcharts()} />
            </Paper>
        );
    }
}

Burndown.propTypes = {
    shouldBurndownDataReload: PropTypes.bool.isRequired,
    burndown: PropTypes.object.isRequired,
    refreshBurndown: PropTypes.func.isRequired,
};

const mapState = state => ({
    shouldBurndownDataReload: state.issuesView.shouldBurndownDataReload,
    burndown: state.issuesView.burndown,
});

const mapDispatch = dispatch => ({
    refreshBurndown: dispatch.issuesView.refreshBurndown,
});

export default connect(mapState, mapDispatch)(Burndown);
