import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import headerStyle from "../../../assets/jss/material-dashboard-react/components/headerStyle.jsx";

import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

class StatsBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, repositories, assignees, issues } = this.props;

        let completedIssues = issues.filter(issue => issue.state === 'CLOSED').length;

        let completedPoints = issues
            .filter(issue => issue.state === 'CLOSED')
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);

        let totalPoints = issues
            .map(issue => issue.points)
            .reduce((acc, points) => acc + points, 0);


        return (
            <div className={classes.wrapper}>
                <GridContainer>
                    <GridItem xs={12} sm={6} md={3}>
                        <i>Completed Issues: {completedIssues} / {issues.length}</i>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <i>Completed Points: {completedPoints} / {totalPoints}</i>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

StatsBar.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    repositories: state.sprintsView.repositories,
    assignees: state.sprintsView.assignees,
    issues: state.sprintsView.issues,
});


export default connect(mapState, null)(withRouter(withStyles(headerStyle)(StatsBar)));
