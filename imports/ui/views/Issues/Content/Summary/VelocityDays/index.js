import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';
import { Run } from 'mdi-material-ui';

import dashboardStyle from "../../../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import Card from "../../../../../components/Card/Card";
import CardHeader from "../../../../../components/Card/CardHeader";
import CardIcon from "../../../../../components/Card/CardIcon";
import CardFooter from "../../../../../components/Card/CardFooter";
import CardBody from "../../../../../components/Card/CardBody";
import VelocityBar from "../../../../../components/Charts/VelocityBar";
import VelocityLine from "../../../../../components/Charts/VelocityLine";

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
                return {x: new Date(v.date).getDate().toString(), y: v.completion[metric].velocity}
            });
            return [{id: 'rolling', data: dataset}];
        } else {
            return [{id: 'rolling', data: []}];
        }
    };

    getVelocityBar(dataset) {
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: new Date(v.date).getDate().toString(), y: v.completion[metric].count}
            });
            return dataset;
        } else {
            return [];
        }
    };

    buildDataset() {
        const { velocity } = this.props;
        if (velocity['days'] !== undefined ) {
            let startPos = 0;
            let endPos = velocity['days'].length;
            if (velocity['days'].length > 20) {
                startPos = velocity['days'].length - 20;
            }
            return velocity['days'].slice(startPos, endPos);
        } else {
            return [];
        }
    };

    getLastDayCompleted(dataset) {
        let idx = dataset.length - 1;
        if (idx >= 0) {
            return dataset[idx].completion.issues.count;
        } else {
            return '-';
        }
    };

    getLastDayTxtCompleted(dataset) {
        let idx = dataset.length - 1;
        if (idx >= 0) {
            return new Date(dataset[idx]['date']).toLocaleDateString('en-US', { weekday: 'long' });
        } else {
            return '-';
        }
    };

    getDefaultRemainingTxtShrt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Pts';
        } else {
            return 'Tkts';
        }
    };

    render() {
        const { classes } = this.props;
        let dataset = this.buildDataset();
        return (
            <Card>
                <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                        <Run />
                    </CardIcon>
                    <p className={classes.cardCategory}>Completed {this.getLastDayTxtCompleted(dataset)}</p>
                    <h3 className={classes.cardTitle}>
                        {this.getLastDayCompleted(dataset)} {this.getDefaultRemainingTxtShrt()}
                    </h3>
                </CardHeader>
                <CardBody>
                    <VelocityBar data={this.getVelocityBar(dataset)} />
                    <VelocityLine data={this.getVelocityLine(dataset)} />
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        Velocity over the past 20 days
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

VelocityDays.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(VelocityDays);
