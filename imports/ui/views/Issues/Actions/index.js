import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import PointsSwitch from './PointsSwitch.js';

import Refresh from './Refresh.js';

const styles = {
    root: {
    },
    toolbarButtons: {
        flex: 1,
    },
};


class Actions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const {
            classes,
            setDefaultPoints,
            defaultPoints,
        } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <div className={classes.toolbarButtons}>
                            <Refresh />
                        </div>
                        <PointsSwitch
                            defaultPoints={defaultPoints}
                            setDefaultPoints={setDefaultPoints}
                        />
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Actions.propTypes = {
    classes: PropTypes.object.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    setDefaultPoints: PropTypes.func.isRequired,
};

const mapState = state => ({
    defaultPoints: state.issuesView.defaultPoints,
});

const mapDispatch = dispatch => ({
    setDefaultPoints: dispatch.issuesView.setDefaultPoints,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Actions));
