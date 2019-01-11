import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import Refresh from './Refresh';
import Select from './Select';
import Create from './Create';

import RefreshAll from './RefreshAll.js';


import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";

const styles = {
    toolbarButtons: {
        flex: 1,
    },
};

class Actions extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, setLoadFlag, setLoadRepos } = this.props;
        return (
            <AppBar position="static" color="primary" className={classes.appBar}>
                <Toolbar>
                    <div className={classes.toolbarButtons}>
                        <Select />
                        <RefreshAll
                            setLoadFlag={setLoadFlag}
                            setLoadRepos={setLoadRepos}
                        />
                        <Refresh />
                    </div>
                    <Create />
                </Toolbar>
            </AppBar>
        );
    }
}

Actions.propTypes = {
    classes: PropTypes.object.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setLoadRepos: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setDefaultPoints: dispatch.issuesView.setDefaultPoints,

    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,
});

export default connect(null, mapDispatch)(withStyles(styles)(Actions));
