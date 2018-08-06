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
import {getWeekYear} from "../../../utils/velocity";

import AssigneeTable from './AssigneeTable.js';


class OverallAssigneesVelocityWeeks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <Card>
                <CardHeader color="success">
                    <h4 className={classes.cardTitleWhite}>Velocity and remaining work per assignee</h4>
                    <p className={classes.cardCategoryWhite}>
                        Calculated over the entire period
                    </p>
                </CardHeader>
                <CardBody>
                    <AssigneeTable />
                </CardBody>
            </Card>
        );
    }
}

OverallAssigneesVelocityWeeks.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(OverallAssigneesVelocityWeeks));
