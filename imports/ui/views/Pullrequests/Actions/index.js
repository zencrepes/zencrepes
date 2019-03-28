import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import PointsSwitch from './PointsSwitch.js';
import Refresh from './Refresh.js';
import Clear from './Clear.js';

import Grid from '@material-ui/core/Grid';

class Actions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const {
            setDefaultPoints,
            defaultPoints,
        } = this.props;
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
                            <Refresh />
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={8}
                            >
                                <Grid item>
                                    <PointsSwitch
                                        defaultPoints={defaultPoints}
                                        setDefaultPoints={setDefaultPoints}
                                    />
                                </Grid>
                                <Grid item>
                                    <Clear />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

Actions.propTypes = {
    defaultPoints: PropTypes.bool.isRequired,
    setDefaultPoints: PropTypes.func.isRequired,
};

const mapState = state => ({
    defaultPoints: state.pullrequestsView.defaultPoints,
});

const mapDispatch = dispatch => ({
    setDefaultPoints: dispatch.pullrequestsView.setDefaultPoints,
});

export default connect(mapState, mapDispatch)(Actions);
