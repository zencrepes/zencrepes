import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";

import AppMenu from '../../components/AppMenu/index.js';
import EstimateCompletion from '../../components/Cards/EstimateCompletion/index.js';
import WeeklyVelocity from '../../components/Cards/WeeklyVelocity/index.js';
import WorkRepartition from '../../components/Cards/WorkRepartition/index.js';



import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import Issues, { cfgIssues } from '../../data/Issues.js';
import Grid from 'material-ui/Grid';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        paddingTop: 80,
        minWidth: 0, // So the Typography noWrap works
    },
    gridList: {
        width: '100%',
        //height: 450,
    },
    subheader: {
        width: '100%',
    },
});

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppMenu />
                <main className={classes.content}>
                    <GridList className={classes.gridList} cols={6}>
                        <GridListTile cols={2} rows={2}>
                            <EstimateCompletion />
                        </GridListTile>
                        <GridListTile cols={4} rows={2}>
                            <WorkRepartition />
                        </GridListTile>
                        <GridListTile cols={3} rows={2}>
                            <WeeklyVelocity />
                        </GridListTile>
                    </GridList>
                </main>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(Dashboard)));