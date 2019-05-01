import React, { Component } from 'react';
import PropTypes from "prop-types";

import {getWeekYear} from "../../../utils/velocity/index";
import CustomCard from '../../../components/CustomCard/index.js';
import VelocityChart from '../../../components/Charts/Highcharts/VelocityChart.js';

//import CombinationChart from "./CombinationChart.js";

import {connect} from "react-redux";

class VelocityWeeks extends Component {
    constructor(props) {
        super(props);
    }

    getVelocityLine(dataset) {
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: getWeekYear(new Date(v.weekStart)).toString(), y: v.completion[metric].velocity}
            });
            return [{id: 'rolling', data: dataset}];
        } else {
            return [{id: 'rolling', data: []}];
        }
    }

    getVelocityBar(dataset) {
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: getWeekYear(new Date(v.weekStart)).toString(), y: v.completion[metric].count}
            });
            return dataset;
        } else {
            return [];
        }
    }

    buildDataset() {
        const { velocity } = this.props;
        if (velocity['weeks'] !== undefined ) {
            let startPos = 0;
            let endPos = velocity['weeks'].length;
            if (velocity['weeks'].length > 16) {
                startPos = velocity['weeks'].length - 16;
            }
            return velocity['weeks'].slice(startPos, endPos);
        } else {
            return [];
        }
    }

    getThisWeekCompleted(dataset) {
        let idx = dataset.length - 1;
        if (idx >= 0) {
            return dataset[idx].completion.points.count;
        } else {
            return '-';
        }
    }

    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Pts';
        } else {
            return 'Tkts';
        }
    }

    render() {
        const { defaultPoints, assignees, velocityTeam } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        let dataset = this.buildDataset();
        return (
            <CustomCard
                headerTitle="Week velocity over 16 weeks"
                headerFactTitle="Completed this week"
                headerFactValue={this.getThisWeekCompleted(dataset) + " " + this.getDefaultRemainingTxtShrt()}
                headerLegend="This chart is the combined rolling average (4 weeks) velocity of all people assigned to a ticket (see table widget below), but without consideration to their respective project. This (on purpose) assumes people are dedicated to the project."
            >
                <VelocityChart
                    dataset={dataset}
                    metric={metric}
                />
                {(assignees !== undefined && assignees.length > 0) &&
                    <i>Combined velocity of&nbsp;
                        {velocityTeam === true ? (
                            <a href="#assignees-table">{assignees.filter(assignee => assignee.core === true).length} project team members</a>
                        ) : (
                            <a href="#assignees-table">{assignees.length} assignees</a>
                        )}
                        &nbsp;across all of their closed issues.</i>
                }
            </CustomCard>
        );
    }
}

VelocityWeeks.propTypes = {
    dataset: PropTypes.array,
    assignees: PropTypes.array,
    defaultPoints: PropTypes.bool,
    velocity: PropTypes.object,
    velocityTeam: PropTypes.bool,
};

const mapState = state => ({
    assignees: state.projectView.assignees,
    velocity: state.projectView.velocity,
    velocityTeam: state.projectView.velocityTeam,
    defaultPoints: state.projectView.defaultPoints,
});

export default connect(mapState, null)(VelocityWeeks);