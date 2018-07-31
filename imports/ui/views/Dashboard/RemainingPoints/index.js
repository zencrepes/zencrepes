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
import ReposTreemap from "./ReposTreemap";

class RemainingPoints extends Component {
    constructor(props) {
        super(props);
    }

    getDefaultRemaining() {
        const { defaultPoints, remainingCount, remainingPoints } = this.props;
        if (defaultPoints) {
            return remainingPoints;
        } else {
            return remainingCount;
        }
    };

    getDefaultRemainingTxt() {
        const { defaultPoints } = this.props;
        if (defaultPoints) {
            return 'Points';
        } else {
            return 'Issues';
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

    handleChange = name => event => {
        const { setDefaultPoints } = this.props;
        setDefaultPoints(event.target.checked);
    };

    render() {
        const { classes } = this.props;
        return (
            <Card>
                <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                        <ContentCopy />
                    </CardIcon>
                    <p className={classes.cardCategory}>Remaining {this.getDefaultRemainingTxt()}</p>
                    <h3 className={classes.cardTitle}>
                        {this.getDefaultRemaining()} {this.getDefaultRemainingTxtShrt()}
                    </h3>
                </CardHeader>
                <CardBody>
                    <ReposTreemap />
                </CardBody>
                <CardFooter stats>
                    <div className={classes.stats}>
                        Work repartition by repository
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

RemainingPoints.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({
    velocity: state.velocity.velocity,
    remainingCount: state.remaining.count,
    remainingPoints: state.remaining.points,
    defaultPoints: state.remaining.defaultPoints,
});

const mapDispatch = dispatch => ({
    setDefaultPoints: dispatch.remaining.setDefaultPoints,

});

export default connect(mapState, mapDispatch)(withStyles(dashboardStyle)(RemainingPoints));
