import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import IssuesGraph from './IssuesGraph/index.js';
import Controls from './Controls/index.js';

class Graph extends Component {
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
                    <Grid item xs={12} sm={9} md={9}>
                        <IssuesGraph />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        <Controls />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default Graph;
