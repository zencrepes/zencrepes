import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import { RunFast } from 'mdi-material-ui';

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import Card from "../../Card/Card";
import CardHeader from "../../Card/CardHeader";
import CardIcon from "../../Card/CardIcon";
import CardFooter from "../../Card/CardFooter";
import CardBody from "../../Card/CardBody";
import VelocityBar from "../../Charts/VelocityBar";
import VelocityLine from "../../Charts/VelocityLine";
import {getWeekYear} from "../../../utils/velocity/index";

import CustomCard from '../../CustomCard/index.js';

import CombinationChart from "./CombinationChart.js";

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
            if (velocity['days'].length > 16) {
                startPos = velocity['days'].length - 16;
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
    };


    render() {
        const { classes, defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        let dataset = this.buildDataset();
        return (
            <CustomCard
                headerTitle="Velocity over 16 days"
                headerFactTitle="Completed today"
                headerFactValue={this.getTodayCompleted(dataset) + " " + this.getDefaultRemainingTxtShrt()}
            >
                <CombinationChart
                    dataset={dataset}
                    metric={metric}
                />
            </CustomCard>
        );
    }
}

VelocityDays.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(dashboardStyle)(VelocityDays);
