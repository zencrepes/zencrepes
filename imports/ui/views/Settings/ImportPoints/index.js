import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import Grid from "@material-ui/core/Grid/Grid";

import Zenhub from './Zenhub.js';
import Waffle from './Waffle.js';
import Push from './Push.js';

class ImportPoints extends Component {
    constructor(props) {
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
                    <Grid item xs={6} sm container>
                        <Zenhub />
                    </Grid>
                    <Grid item xs={6} sm container>
                        <Waffle />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm container>
                        <Push />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

ImportPoints.propTypes = {
};

export default connect(null, null)(withRouter(ImportPoints));
