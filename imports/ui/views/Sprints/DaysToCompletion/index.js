import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import { CalendarClock } from 'mdi-material-ui';


import PropTypes from "prop-types";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardIcon from "../../../components/Card/CardIcon";
import {ContentCopy, DateRange} from "@material-ui/icons";
import CardFooter from "../../../components/Card/CardFooter";
import CardBody from "../../../components/Card/CardBody";
import VelocityBarHorizontal from "../../../components/Charts/VelocityBarHorizontal";

class DaysToCompletion extends Component {
    constructor(props) {
        super(props);
    }

    /*
    TODO - Make it better, very very badly coded
    Find effortCountDays closest to current date
    */
    getTimeToCompletion(dataset) {
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

//        console.log(dataset);
        let effort = 0;
        if (dataset !== undefined ) {
            let filteredValues = dataset.filter(v => v.completion[metric].effort !== undefined)

            let rangeValues = [];
            effort = filteredValues.find(v => v.range === '4w');
            if (effort !== undefined) {
                if (effort.completion[metric].effort !== undefined && effort.completion[metric].effort !== Infinity) {
                    rangeValues.push(effort);
                }
            }

            effort = filteredValues.find(v => v.range === '8w');
            if (effort !== undefined) {
                if (effort.completion[metric].effort !== undefined && effort.completion[metric].effort !== Infinity) {
                    rangeValues.push(effort);
                }
            }
            effort = filteredValues.find(v => v.range === '12w');
            if (effort !== undefined) {
                if (effort.completion[metric].effort !== undefined && effort.completion[metric].effort !== Infinity) {
                    rangeValues.push(effort);
                }
            }
            effort = filteredValues.find(v => v.range === 'all');
            if (effort !== undefined) {
                if (effort.completion[metric].effort !== undefined && effort.completion[metric].effort !== Infinity) {
                    rangeValues.push(effort);
                }
            }
            if (rangeValues.length === 0) {
                return '-';
            } else {
                return Math.round(rangeValues[0].completion[metric].effort, 1);
            }

        } else {
            return '-';
        }
    }

    getVelocityBar(dataset) {
        const { defaultPoints } = this.props;
        let metric = 'points';
        if (!defaultPoints) {metric = 'issues';}

        if (dataset !== undefined ) {
            dataset = dataset.filter(v => v.completion[metric].effort !== Infinity);
            dataset = dataset.map((v) => {
                return {x: v.range, y: v.completion[metric].effort}
            });
            return dataset;
        } else {
            return [];
        }
    }

    render() {
        const { classes, velocity } = this.props;
        return (
            <Card>
                <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                        <CalendarClock />
                    </CardIcon>
                    <p className={classes.cardCategory}>Days to Completion</p>
                    <h3 className={classes.cardTitle}>
                        {this.getTimeToCompletion(velocity.velocity)} days
                    </h3>
                </CardHeader>
                <CardBody>
                    <VelocityBarHorizontal data={this.getVelocityBar(velocity.velocity)} />
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        Default based on 4 weeks rolling averages
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

DaysToCompletion.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    velocity: state.sprintsView.velocity,
    defaultPoints: true,
});

export default connect(mapState, null)(withStyles(dashboardStyle)(DaysToCompletion));
