import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import Assignees from './Assignees/index.js';
import Projects from './Projects/index.js';
import Milestones from './Milestones/index.js';
import Areas from './Areas/index.js';

class Contributions extends Component {
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
                    <Grid item xs={6} sm={3} md={4}>
                        <Projects />
                    </Grid>
                    <Grid item xs={6} sm={3} md={4}>
                        <Milestones />
                    </Grid>
                    <Grid item xs={6} sm={3} md={4}>
                        <Areas />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={12} md={12}>
                        <Assignees />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default Contributions;
