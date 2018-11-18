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

import LabelsTable from './LabelsTable.js';

class Assignees extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, labels } = this.props;
        return (
            <Card>
                <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                        <CalendarClock />
                    </CardIcon>
                    <p className={classes.cardCategory}>Labels</p>
                    <h3 className={classes.cardTitle}>
                        {labels.length}
                    </h3>
                </CardHeader>
                <CardBody>
                    <LabelsTable labels={labels} />
                </CardBody>
            </Card>
        );
    }
}

Assignees.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    labels: state.sprintsView.labels,
});

export default connect(mapState, null)(withStyles(dashboardStyle)(Assignees));
