import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import Sidebar from '../../components/Sidebar/index.js';
import Footer from '../../components/Footer/Footer.js';
import Header from '../../components/Header/index.js';

import PropTypes from "prop-types";

import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Repositories from './Repositories/index.js';
import StoryPoints from './StoryPoints/index.js';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            value: 0
        };
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

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
                        pageName={"Settings"}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                            >
                                <Tab label="Repositories" />
                                <Tab label="Configure Points" />
                                <Tab label="Import Points" />
                            </Tabs>
                            {value === 0 && <TabContainer><Repositories/></TabContainer>}
                            {value === 1 && <TabContainer><StoryPoints /></TabContainer>}
                            {value === 2 && <TabContainer>Item Three</TabContainer>}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

Settings.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(Settings)));
