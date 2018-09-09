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
import Facets from "./Facets";
import IssuesTable from "./IssuesTable.js";
import GitRequests from "../../components/Github/GitRequests";
import SyncFilters from "./SyncFilters.js";

import LoadingAll from '../../components/Loading/All/index.js'

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
                    logoText={"Zen Crepes"}
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
                            <LoadingAll />
                            <div className={classes.mainContent}>
                                <div className={classes.Query}>
                                    <QueryView />
                                </div>
                                <div className={classes.Facets}>
                                    <Facets />
                                </div>
                                <div className={classes.Results}>
                                    <IssuesTable />
                                </div>
                            </div>
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
