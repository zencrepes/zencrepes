import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import PropTypes from "prop-types";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardIcon from "../../../components/Card/CardIcon";
import {ContentCopy, DateRange} from "@material-ui/icons";
import CardFooter from "../../../components/Card/CardFooter";
import CardBody from "../../../components/Card/CardBody";
import VelocityBar from "../../../components/Cards/shared/VelocityBar";
import VelocityLine from "../../../components/Cards/shared/VelocityLine";

class VelocitDays extends Component {
    constructor(props) {
        super(props);
    }

    getVelocityLine(dataset) {
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        if (dataset.length > 0 ) {
            dataset = dataset.map((v) => {
                return {x: new Date(v.date).getDate().toString(), y: v[metric].velocity}
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
                return {x: new Date(v.date).getDate().toString(), y: v[metric].count}
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
            return dataset[idx].issues.count;
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
                <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                        <ContentCopy />
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

VelocitDays.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    velocity: state.velocity.velocity,
    defaultPoints: state.velocity.defaultPoints,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(VelocitDays));
