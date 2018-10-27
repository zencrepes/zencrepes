import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import Sidebar from '../../components/Sidebar/index.js';
import Footer from '../../components/Footer/Footer.js';
import Header from '../../components/Header/index.js';

import PropTypes from "prop-types";

import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import Grid from '@material-ui/core/Grid';

import IssuesFacets from './Facets/index.js';
import IssuesQuery from './Query/index.js';
import IssuesTabs from './Tabs/index.js';
import IssuesContent from './Content/index.js';

class Issues extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
        };
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    componentDidMount() {
        const { initIssues } = this.props;
        initIssues();
    };

    render() {
        const { classes } = this.props;
        const { labels, colors, descriptions } = this.state;

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
                        pageName={"Issues"}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={8}
                            >
                                <Grid item >
                                    <IssuesFacets />
                                </Grid>
                                <Grid item xs={12} sm container>
                                    <Grid
                                        container
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                    >
                                        <Grid item xs={12} sm className={classes.fullWidth}>
                                            <IssuesQuery />
                                        </Grid>
                                        <Grid item xs={12} sm className={classes.fullWidth}>
                                            <IssuesTabs />
                                        </Grid>
                                        <Grid item xs={12} sm className={classes.fullWidth}>
                                            <IssuesContent />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

Issues.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    initIssues: dispatch.issuesView.initIssues,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(Issues)));
