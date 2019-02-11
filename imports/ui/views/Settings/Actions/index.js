import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Clear from './Clear.js';
import Grid from '@material-ui/core/Grid';

class Actions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm container>
                        </Grid>
                        <Grid item >
                            <Clear />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Actions;
