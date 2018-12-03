import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import PointsSwitch from './PointsSwitch.js';
import RefreshAll from './RefreshAll.js';
import RefreshSelected from './RefreshSelected.js';
import RefreshIssues from './RefreshIssues.js';

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
    toolbarButtons: {
        flex: 1,
    },
});


class Actions extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const {
            classes,
            setDefaultPoints,
            defaultPoints,
            setLoadFlag,
            setLoadRepos,
            facets
        } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <div className={classes.toolbarButtons}>
                            <RefreshAll
                                setLoadFlag={setLoadFlag}
                                setLoadRepos={setLoadRepos}
                            />
                            <RefreshSelected
                                setLoadFlag={setLoadFlag}
                                setLoadRepos={setLoadRepos}
                                facets={facets}
                            />
                            <RefreshIssues />
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
};

const mapState = state => ({
    defaultPoints: state.issuesView.defaultPoints,

    facets: state.issuesView.facets,
});

const mapDispatch = dispatch => ({
    setDefaultPoints: dispatch.issuesView.setDefaultPoints,

    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Actions));
