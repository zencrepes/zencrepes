import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {ContentCopy} from "@material-ui/icons";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardIcon from "../../../components/Card/CardIcon";
import CardFooter from "../../../components/Card/CardFooter";
import CardBody from "../../../components/Card/CardBody";

import { AccountGroup } from 'mdi-material-ui';

import RepartitionPie from "./RepartitionPie";

class TimeToCompletionAssignee extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, velocity } = this.props;
        return (
            <Card>
                <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                        <AccountGroup />
                    </CardIcon>
                    <p className={classes.cardCategory}>Time to completion</p>
                    <h3 className={classes.cardTitle}>

                    </h3>
                </CardHeader>
                <CardBody>
                    <RepartitionPie />
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        Days to completion by Assignee (top 10)
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

TimeToCompletionAssignee.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    velocity: state.velocity.velocity,
    defaultPoints: state.velocity.defaultPoints,
});

export default connect(mapState, null)(withStyles(dashboardStyle)(TimeToCompletionAssignee));
