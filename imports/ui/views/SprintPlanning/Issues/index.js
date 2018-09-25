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

import {cfgIssues} from "../../../data/Minimongo";

import IssuesTable from './IssuesTable.js';

class Issues extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, sprintName } = this.props;

        return (
            <Card>
                <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                        <CalendarClock />
                    </CardIcon>
                    <p className={classes.cardCategory}>Issues in Sprint</p>
                    <h3 className={classes.cardTitle}>
                        {cfgIssues.find({'milestone.title':{'$in':[sprintName]}}).count()}
                    </h3>
                </CardHeader>
                <CardBody>
                    <IssuesTable issues={cfgIssues.find({'milestone.title':{'$in':[sprintName]}}).fetch()}/>
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        Subtitle
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

Issues.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    sprintName: state.sprintPlanning.sprintName,

});

export default connect(mapState, null)(withStyles(dashboardStyle)(Issues));
