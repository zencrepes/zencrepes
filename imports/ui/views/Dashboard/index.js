import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import Sidebar from './Sidebar.js';
import Footer from './Footer.js';
import Header from './Header.js';

import DataLoader from './DataLoader.js';

import PropTypes from "prop-types";

import Toolbar from '@material-ui/core/Grid';
import Grid from '@material-ui/core/Grid';
import {ContentCopy, DateRange, LocalOffer, Store, Update, Warning} from "@material-ui/icons";

import QuerySelect from "../../components/Query/Select";
import SprintsSelect from "../../components/Sprints/Select";
import PointSwitch from "../../pages/dashboard/PointsSwitch";

import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardIcon from '../../components/Card/CardIcon.js';
import CardFooter from '../../components/Card/CardFooter.js';

import RemainingPoints from './RemainingPoints/index.js';

class Dashboard extends Component {
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
                            <DataLoader/>
                            <Toolbar className={classes.container}>
                                <QuerySelect />
                                <SprintsSelect />
                                <PointSwitch />
                            </Toolbar>

                            <RemainingPoints/>

                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(Dashboard)));
