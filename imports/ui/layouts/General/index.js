import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import styles from "./styles.jsx";

import Header from '../../components/Header/index.js';
import Footer from '../../components/Footer/index.js';

class General extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, children } = this.props;
        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item xs={12} sm className={classes.fullWidth}>
                        <Header />
                    </Grid>
                    <Grid item xs={12} sm className={classes.fullWidth}>
                        {children}
                    </Grid>
                    <Grid item xs={12} sm className={classes.fullWidth}>
                        <Footer />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

General.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(General);
