import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import { CalendarClock } from 'mdi-material-ui';

import PropTypes from "prop-types";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import {ContentCopy, DateRange} from "@material-ui/icons";
import CardFooter from "../../components/Card/CardFooter";
import CardBody from "../../components/Card/CardBody";

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, velocity } = this.props;
        return (
            <Card>
                <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                        <CalendarClock />
                    </CardIcon>
                    <p className={classes.cardCategory}>Repositories</p>
                    <h3 className={classes.cardTitle}>
                        X
                    </h3>
                </CardHeader>
                <CardBody>
                    Display a table-like view with the list of repositories. <br />
                    Add button to add repository to sprint (even if not assigned to issues yet).
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

Repositories.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

export default connect(mapState, null)(withStyles(dashboardStyle)(Repositories));
