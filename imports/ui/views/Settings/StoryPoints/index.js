import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import Fibonacci from './Fibonacci.js';

class StoryPoints extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                    <h4>Enable Points</h4>
                    <Fibonacci />
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                    <h4>Remote sources</h4>
                </GridItem>
            </GridContainer>
        );
    }
}

StoryPoints.propTypes = {
    classes: PropTypes.object,
};

export default connect(null, null)(withRouter(withStyles(dashboardStyle)(StoryPoints)));
