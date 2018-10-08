import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import dashboardStyle from "../../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import Sidebar from '../../../components/Sidebar/index.js';
import Footer from '../../../components/Footer/Footer.js';
import Header from '../../../components/Header/index.js';

import PropTypes from "prop-types";

import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import LabelsFetch from '../../../data/Labels/Fetch/index.js';

import LabelsTable from './LabelsTable.js';
import ButtonRefresh from './ButtonRefresh.js';

class LabelsList extends Component {
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
        const { updateLabels } = this.props;
        updateLabels();
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
                        pageName={"List Labels"}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <ButtonRefresh />
                            <LabelsFetch loadModal={false} />

                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <LabelsTable />
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

LabelsList.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    updateLabels: dispatch.labelsView.updateLabels,

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(LabelsList)));
