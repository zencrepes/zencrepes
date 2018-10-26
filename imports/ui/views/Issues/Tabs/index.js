import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import PointsSwitch from './PointsSwitch.js';

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class IssuesTabs extends Component {
    constructor (props) {
        super(props);
    }

    handleChange = (event, value) => {
        const { setSelectedTab } = this.props;
        setSelectedTab(value);
    };

    render() {
        const { classes, selectedTab } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.flex}>
                    <Tabs
                        value={selectedTab}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Summary" />
                        <Tab label="List" />
                        <Tab label="Velocity" />
                        <Tab label="Burndown" />
                    </Tabs>
                </div>
                <div style={{ display: "flex" }} >
                    <PointsSwitch />
                </div>
            </div>
        );
    }
}

IssuesTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    selectedTab: state.issuesView.selectedTab,

});

const mapDispatch = dispatch => ({
    setSelectedTab: dispatch.issuesView.setSelectedTab,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTabs));
