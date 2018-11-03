import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import PointsSwitch from './PointsSwitch.js';

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class Actions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, selectedTab } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <div className={classes.toolbarButtons}>
                            <span>Buttons</span>
                        </div>
                        <PointsSwitch />
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Actions.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Actions));
