import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import Sidebar from '../../components/Sidebar/index.js';
import Footer from '../../components/Footer/Footer.js';
import Header from '../../components/Header/index.js';

import PropTypes from "prop-types";

import AppBar from '@material-ui/core/AppBar';


import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';

import OverallVelocityWeeks from '../../components/Cards/OverallVelocityWeeks/index.js';
import OverallMemberVelocityWeeks from '../../components/Cards/OverallMemberVelocityWeeks/index.js';
import {ContentCopy, LocalOffer} from "@material-ui/icons/index";

import QuerySelect from '../../components/Query/Select/index.js';
import DataLoader from '../../pages/velocity/DataLoader.js';


class Velocity extends Component {
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
                    logoText={"Agile App"}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.mobileOpen}
                    color="blue"
                />
                <div className={classes.mainPanel} ref="mainPanel">
                    <Header
                        handleDrawerToggle={this.handleDrawerToggle}
                        pageName={"Dashboard"}
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
                                    <OverallVelocityWeeks
                                        icon={ContentCopy}
                                        iconColor="red"
                                        title="Completed this week"
                                        description="32"
                                        small="Pts"
                                        statIcon={LocalOffer}
                                        statText="Add small chart showing velocity past 16 weeks"
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <OverallMemberVelocityWeeks
                                        icon={ContentCopy}
                                        iconColor="red"
                                        title="Completed this week"
                                        description="32"
                                        small="Pts"
                                        statIcon={LocalOffer}
                                        statText="Add small chart showing velocity past 16 weeks"
                                    />
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

Velocity.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(Velocity)));
