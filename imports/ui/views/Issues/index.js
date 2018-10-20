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

import Facets from './Facets/index.js';

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
                            <h1>Issues view content</h1>
                            <Facets />
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
