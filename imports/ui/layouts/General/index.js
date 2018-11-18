import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import styles from "./styles.jsx";

import HeaderToolbar from '../../components/Header/Toolbar/index.js';
import FooterToolbar from '../../components/Footer/Toolbar/index.js';

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
                        <HeaderToolbar />
                    </Grid>
                    <Grid item xs={12} sm className={classes.fullWidth}>
                        {children}
                    </Grid>
                    <Grid item xs={12} sm className={classes.fullWidth}>
                        <FooterToolbar />
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
