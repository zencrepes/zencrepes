import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

class Repositories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                    <h3>Search for Repositories</h3>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                    <h3>Select repositories</h3>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                    <h3>Load Data</h3>
                </GridItem>
            </GridContainer>
        );
    }
}

Repositories.propTypes = {
    classes: PropTypes.object,
};

export default connect(null, null)(withRouter(withStyles(dashboardStyle)(Repositories)));
