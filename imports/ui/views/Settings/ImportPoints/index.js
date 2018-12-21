import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid/Grid";

import Zenhub from './Zenhub.js';
import Waffle from './Waffle.js';
import Push from './Push.js';

const styles = theme => ({
    root: {
    },
});

class ImportPoints extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
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
    classes: PropTypes.object,
};

export default connect(null, null)(withRouter(withStyles(styles)(ImportPoints)));
