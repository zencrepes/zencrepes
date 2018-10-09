import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter, Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import dashboardStyle from "../../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import Sidebar from '../../../components/Sidebar/index.js';
import Footer from '../../../components/Footer/Footer.js';
import Header from '../../../components/Header/index.js';

import PropTypes from "prop-types";

import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import SelectedColors from './Stats/SelectedColors.js';
import SelectedDescriptions from './Stats/SelectedDescriptions.js';
import EditSelection from './Selection/index.js';
import EditActions from './Actions/index.js';

import LabelsEdit from '../../../data/Labels/Edit/index.js';

class LabelEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    componentDidMount() {
        console.log('componentDidMount');
        const { initConfiguration } = this.props;
        let labelName = this.props.match.params.name;
        initConfiguration(labelName)
    }

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
                        pageName={"Editing label: " + this.props.match.params.name}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <LabelsEdit loadModal={false} />
                            <Link to="/labels"><Button className={classes.button}>Back to List</Button></Link>
                            <GridContainer>
                                <GridItem xs={12} sm={6} md={4}>
                                    <SelectedColors />
                                </GridItem>
                                <GridItem xs={12} sm={6} md={8}>
                                    <SelectedDescriptions />
                                </GridItem>
                                <GridItem xs={12} sm={6} md={6}>
                                    <EditSelection />
                                </GridItem>
                                <GridItem xs={12} sm={6} md={6}>
                                    <EditActions />
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

LabelEdit.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    initConfiguration: dispatch.labelsEdit.initConfiguration,
});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(LabelEdit)));
