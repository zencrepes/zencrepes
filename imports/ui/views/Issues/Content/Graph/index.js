import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import IssuesGraph from './IssuesGraph/index.js';

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
                    <Grid item xs={12} sm={12} md={12}>
                        <IssuesGraph />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default Graph;
