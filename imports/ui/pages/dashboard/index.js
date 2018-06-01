import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";

import AppMenu from '../../components/AppMenu/index.js';
import EstimateCompletion from '../../components/Cards/EstimateCompletion/index.js';

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
        padding: theme.spacing.unit * 3,
        paddingTop: 80,
        minWidth: 0, // So the Typography noWrap works
    },
    gridList: {
        width: 500,
        height: 450,
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
                    <GridList className={classes.gridList}>
                        <GridListTile cols={2}>
                            <EstimateCompletion />
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