import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import Sidebar from '../../components/Sidebar/index.js';
import Footer from '../../components/Footer/Footer.js';
import Header from '../../components/Header/index.js';

import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import QuerySelect from '../../components/Query/Select/index.js';

import OverallVelocityWeeks from './OverallVelocityWeeks/index.js';
import DataLoader from './DataLoader.js';


class Burndown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.wrapper}>
                <Sidebar
                    logoText={"Zen Crepes"}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.mobileOpen}
                    color="blue"
                />
                <div className={classes.mainPanel} ref="mainPanel">
                    <Header
                        handleDrawerToggle={this.handleDrawerToggle}
                        pageName={"Burndown"}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <DataLoader />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <div className={classes.appBar}>
                                        <QuerySelect />
                                    </div>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <OverallVelocityWeeks />
                                </GridItem>
                            </GridContainer>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

Burndown.propTypes = {
    classes: PropTypes.object,

};

export default connect(null, null)(withRouter(withStyles(dashboardStyle)(Burndown)));
