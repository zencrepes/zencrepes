import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item >
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
                    </Grid>
                    <Grid item xs={12} sm>
                        <span>to be removed</span>
                    </Grid>
                </Grid>
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
