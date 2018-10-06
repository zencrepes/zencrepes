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

import { cfgMilestones } from "../../../data/Minimongo";

import FetchReposMilestones from "../../../data/FetchReposMilestones";

import MilestonesTable from './MilestonesTable.js';
import LoadButton from './LoadButton.js';

class LabelsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            milestones: []
        };
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    componentDidMount() {
        console.log('componentDidMount');
        let uniqueTitles = _.groupBy(cfgMilestones.find({}).fetch(), 'title');

        let milestones = [];
        Object.keys(uniqueTitles).map(idx => {
            let stateElements = _.groupBy(uniqueTitles[idx], 'state');
            let states = Object.keys(stateElements).map(idx => {return {
                items: stateElements[idx],
                value: idx,
                count: stateElements[idx].length,
            }});
            states = _.sortBy(states, [function(o) {return o.count;}]);
            states = states.reverse();

            milestones.push({
                title: idx,
                count: uniqueTitles[idx].length,
                milestones: uniqueTitles[idx],
                states: states,
            });

        });
        milestones = _.sortBy(milestones, ['count']);
        milestones = milestones.reverse();
        this.setState({milestones: milestones});
    };

    render() {
        const { classes } = this.props;
        const { milestones } = this.state;

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
                        pageName={"List Milestones"}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                    <LoadButton />
                                    <FetchReposMilestones />
                                    <MilestonesTable milestonesdata={milestones} />
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

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(dashboardStyle)(LabelsList)));
