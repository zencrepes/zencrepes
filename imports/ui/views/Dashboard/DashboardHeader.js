import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import headerStyle from "../../assets/jss/material-dashboard-react/components/headerStyle.jsx";

import QuerySelect from "../../components/Query/Select";
//import SprintsSelect from "../../components/Sprints/Select";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import PointSwitch from "./PointsSwitch";

class DashboardHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.appBar} style={{ position: "static" }} >
                    <Toolbar className={classes.container}>
                        <div className={classes.flex}>
                            <QuerySelect />
                        </div>
                        <div style={{ display: "flex" }} >
                            <PointSwitch />
                        </div>
                    </Toolbar>
                </div>
            </div>
        );
    }
}

DashboardHeader.propTypes = {
    classes: PropTypes.object,
};

export default connect(null, null)(withRouter(withStyles(headerStyle)(DashboardHeader)));
