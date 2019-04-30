import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import DaysToCompletion from './DaysToCompletion/index.js';
import RemainingWork from './RemainingRepositories/index.js';
import RemainingByAssignee from './RemainingAssignees/index.js';
import VelocityWeeks from './VelocityWeeks/index.js';
import VelocityDays from './VelocityDays/index.js';

class Summary extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={4} md={4}>
                        <RemainingWork />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                        <RemainingByAssignee />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                        <DaysToCompletion />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <VelocityDays />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <VelocityWeeks />
                    </Grid>

                </Grid>
            </React.Fragment>
        );
    }
}

export default Summary;
