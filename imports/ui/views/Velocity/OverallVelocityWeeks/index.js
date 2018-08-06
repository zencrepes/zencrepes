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
import VelocityBar from "../../../components/Cards/shared/VelocityBar";
import VelocityLine from "../../../components/Cards/shared/VelocityLine";
import {getWeekYear} from "../../../utils/velocity";


import HighchartsVelocity from './HighchartsVelocity.js';

class OverallVelocityWeeks extends Component {
    constructor(props) {
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
        velocity.forEach((v) => {
            issuesCount.push([new Date(v.weekStart).getTime(), Math.round(v.issues.velocity, 1)]);
            storyPoints.push([new Date(v.weekStart).getTime(), Math.round(v.points.velocity, 1)]);
        });
        if (issuesCount.length === 0) {
            return [];
        } else {
            return [
                {id: 'issues-' + uuidv1(), name: 'Issues', weeks: issuesCount},
                {id: 'points-' + uuidv1(), name: 'Story Points', weeks: storyPoints}
            ];
        }
    }

    render() {
        const { classes } = this.props;

        let dataset = this.prepareDataset();
        return (
            <Card>
                <CardHeader color="warning">
                    <h4 className={classes.cardTitleWhite}>Weekly Velocity</h4>
                    <p className={classes.cardCategoryWhite}>
                        Calculated over the entire period
                    </p>
                </CardHeader>
                <CardBody>
                    <HighchartsVelocity data={this.getVelocityHighcharts(dataset)} />
                </CardBody>
            </Card>
        );
    }
}

OverallVelocityWeeks.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    velocity: state.velocity.velocity,

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(OverallVelocityWeeks));
