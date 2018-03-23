import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import Header from './Header';
import Table from './Table';
import StatsPerDay from './charts/StatsPerDay';
import StatsPerWeek from './charts/StatsPerWeek';
import DaysToCompletion from './charts/DaysToCompletion';

import Menu from './menu/Menu.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

function FullWidthGrid(props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <Header />
                    <Menu />
                </Grid>
                <Grid item xs={12}>
                    <StatsPerDay />
                </Grid>
                <Grid item xs={12}>
                    <StatsPerWeek />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper className={classes.paper}>Stats 1</Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper className={classes.paper}>Stats 2</Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper className={classes.paper}><DaysToCompletion /></Paper>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Paper className={classes.paper}>Facets</Paper>
                </Grid>
                <Grid item xs={6} sm={10}>
                    <Table />
                </Grid>>
            </Grid>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);