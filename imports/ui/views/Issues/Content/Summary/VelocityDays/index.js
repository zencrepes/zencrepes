import React, { Component } from 'react';
import PropTypes from "prop-types";

import {getWeekYear} from "../../../../../utils/velocity/index";
import CustomCard from "../../../../../components/CustomCard/index.js";
import VelocityChart from '../../../../../components/Charts/Highcharts/VelocityChart.js';
import {connect} from "react-redux";

class VelocityDays extends Component {
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
        if (velocity['days'] !== undefined ) {
            let startPos = 0;
            let endPos = velocity['days'].length;
            if (velocity['days'].length > 30) {
                startPos = velocity['days'].length - 30;
            }
            return velocity['days'].slice(startPos, endPos);
        } else {
            return [];
        }
    }

    getTodayCompleted(dataset) {
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
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        let dataset = this.buildDataset();
        return (
            <CustomCard
                headerTitle="Daily velocity over 30 days"
                headerFactTitle="Completed today"
                headerFactValue={this.getTodayCompleted(dataset) + " " + this.getDefaultRemainingTxtShrt()}
                headerLegend="Calculated from all closed issues in the associated query"
            >
                <VelocityChart
                    dataset={dataset}
                    metric={metric}
                />
            </CustomCard>
        );
    }
}

VelocityDays.propTypes = {
    defaultPoints: PropTypes.bool,
    velocity: PropTypes.object,
};

const mapState = state => ({
    defaultPoints: state.issuesView.defaultPoints,
    velocity: state.issuesView.velocity,
});

export default connect(mapState, null)(VelocityDays);

