import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Refresh from './Refresh.js';
import RefreshLabels from './RefreshLabels.js';

const styles = {
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
            setLoadFlag,
        } = this.props;
        return (
            <AppBar position="static" color="primary" className={classes.appBar}>
                <Toolbar>
                    <div className={classes.toolbarButtons}>
                        <Refresh
                            setLoadFlag={setLoadFlag}
                        />
                        <RefreshLabels />
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

Actions.propTypes = {
    classes: PropTypes.object.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    facets: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
};

const mapState = state => ({
    defaultPoints: state.issuesView.defaultPoints,

    facets: state.issuesView.facets,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.labelsFetch.setLoadFlag,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Actions));
