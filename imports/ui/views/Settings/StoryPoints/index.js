import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid/Grid";

import CreatePointsLabels from '../../../data/CreatePointsLabels.js';

import Fibonacci from './Fibonacci.js';
import EnabledRepos from './EnabledRepos/index.js';
import SyncLabels from './SyncLabels.js';

const styles = theme => ({
    root: {
    },
});
class StoryPoints extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={8}
            >
                <Grid item xs={6} sm container>
                    <Fibonacci />
                    <SyncLabels />
                    <CreatePointsLabels />
                </Grid>
                <Grid item xs={6} sm container>
                    <EnabledRepos />
                </Grid>
            </Grid>
        );
    }
}

StoryPoints.propTypes = {
    classes: PropTypes.object,
};

export default connect(null, null)(withRouter(withStyles(styles)(StoryPoints)));
