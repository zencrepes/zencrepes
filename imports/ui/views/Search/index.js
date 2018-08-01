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
import Grid from "material-ui/Grid";
import QueryView from "../../components/Query/View";
import Facets from "../../components/Facets";
import IssuesTable from "../../components/Table";
import GitRequests from "../../components/Github/GitRequests";
import SyncFilters from "./SyncFilters.js";


class Search extends Component {
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
                        pageName={"Search"}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <SyncFilters />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <QueryView />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    <Facets />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={8}>
                                    <IssuesTable />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12}>
                                    <GitRequests />
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

Search.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(Search)));
