import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import Zenhub from './Zenhub.js';

class ImportPoints extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                    <Zenhub />
                </GridItem>
                <GridItem xs={12} sm={6} md={6}>
                    <h4>Waffle</h4>
                </GridItem>
            </GridContainer>
        );
    }
}

ImportPoints.propTypes = {
    classes: PropTypes.object,
};

export default connect(null, null)(withRouter(withStyles(dashboardStyle)(ImportPoints)));
