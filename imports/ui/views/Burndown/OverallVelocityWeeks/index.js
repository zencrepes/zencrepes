import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import uuidv1 from 'uuid/v1';

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import PropTypes from "prop-types";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardIcon from "../../../components/Card/CardIcon";
import {ContentCopy, DateRange} from "@material-ui/icons";
import CardFooter from "../../../components/Card/CardFooter";
import CardBody from "../../../components/Card/CardBody";
import VelocityBar from "../../../components/Charts/VelocityBar";
import VelocityLine from "../../../components/Charts/VelocityLine";
import {getWeekYear} from "../../../utils/velocity";


import HighchartsVelocity from './HighchartsVelocity.js';

class OverallVelocityWeeks extends Component {
    constructor(props) {
        super(props);
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
            <Card>
                <CardHeader color="warning">
                    <h4 className={classes.cardTitleWhite}>Burndown Chart</h4>
                    <p className={classes.cardCategoryWhite}>
                        Calculated over the selectd period
                    </p>
                </CardHeader>
                <CardBody>
                    <HighchartsVelocity data={this.getVelocityHighcharts()} />
                </CardBody>
            </Card>
        );
    }
}

OverallVelocityWeeks.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    burndown: state.burndown.burndown,

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(OverallVelocityWeeks));
