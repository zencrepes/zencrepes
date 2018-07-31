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
import Typography from "@material-ui/core/Typography";
import VelocityBarHorizontal from "../../../components/Cards/shared/VelocityBarHorizontal";
import CardContent from "@material-ui/core/CardContent";

import RepartitionTreemap from "./RepartitionTreemap";

class RepartitionByAssignee extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { classes, velocity } = this.props;
        return (
            <Card>
                <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                        <ContentCopy />
                    </CardIcon>
                    <p className={classes.cardCategory}>Open issues by Assignee</p>
                    <h3 className={classes.cardTitle}>

                    </h3>
                </CardHeader>
                <CardBody>
                    <RepartitionTreemap />
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        Repartition of open issues by Assignee
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

RepartitionByAssignee.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    velocity: state.velocity.velocity,
    defaultPoints: state.velocity.defaultPoints,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(RepartitionByAssignee));
