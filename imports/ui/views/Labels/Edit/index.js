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

import {cfgLabels, cfgSources} from "../../../data/Minimongo";

import SelectedColors from './Stats/SelectedColors.js';
import SelectedDescriptions from './Stats/SelectedDescriptions.js';
import EditSelection from './Selection/index.js';
import EditActions from './Actions/index.js';

import Labels from '../../../data/Labels.js';
import UpdatingLabels from '../../../components/Loading/Labels/index.js';

import LoadingAll from '../../../components/Loading/All/index.js';

class LabelsEdit extends Component {
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
        const { initSelectedRepos, initAvailableRepos, setSelectedName, setLoading } = this.props;
        //When mounting the component, initializing content of the available and selected labels list

        setLoading(true);
        let selectedRepos = [];
        if (this.props.match.params.id !== 'all') {
            selectedRepos = [cfgLabels.findOne({id: this.props.match.params.id}).repo];
        } else {
            selectedRepos = cfgLabels.find({name: this.props.match.params.name}).map(label => label.repo);
        }
        //Add Label details in selectedRepos
        selectedRepos = selectedRepos.map((repo) => {
            return {...repo, label: cfgLabels.findOne({name: this.props.match.params.name, 'repo.id': repo.id})};
        });
        initSelectedRepos(selectedRepos);

        let availableRepos = _.differenceBy(cfgSources.find({}).fetch(), selectedRepos, 'id');
        availableRepos = availableRepos.map((repo) => {
            return {...repo, label: cfgLabels.findOne({name: this.props.match.params.name, 'repo.id': repo.id})};
        });
        initAvailableRepos(availableRepos);

        setSelectedName(this.props.match.params.name);
        setLoading(false);
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
                            <Labels />
                            <UpdatingLabels />
                            <LoadingAll />
                            <Link to="/labels"><Button className={classes.button}>Back to List</Button></Link>
                            <Link to={"/labels/view/" + this.props.match.params.name}><Button className={classes.button}>Back Configuration</Button></Link>
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

LabelsEdit.propTypes = {
    classes: PropTypes.object,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    initAvailableRepos: dispatch.labelsconfiguration.initAvailableRepos,
    initSelectedRepos: dispatch.labelsconfiguration.initSelectedRepos,
    setSelectedName: dispatch.labelsconfiguration.setSelectedName,

    setLoading: dispatch.loading.setLoading,

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(LabelsEdit)));
