import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Grid from "@material-ui/core/Grid/Grid";

import CreatePointsLabels from '../../../data/CreatePointsLabels.js';

import Fibonacci from './Fibonacci.js';
import EnabledRepos from './EnabledRepos/index.js';
import SyncLabels from './SyncLabels.js';

class StoryPoints extends Component {
    constructor(props) {
        super(props);
    }

    render() {
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

export default withRouter(StoryPoints);
