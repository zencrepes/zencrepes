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
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, selectedSprintName, assignees, setLoadFlag, setLoadRepos } = this.props;
        //let assignees = getAssigneesRepartition(cfgIssues.find({'milestone.title':{'$in':[sprintName]}}).fetch());
        return (
            <div className={classes.root}>
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
            </div>
        );
    }
}

Actions.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    selectedSprintName: state.sprintsView.selectedSprintName,
    assignees: state.sprintsView.assignees,
});

const mapDispatch = dispatch => ({
    setDefaultPoints: dispatch.issuesView.setDefaultPoints,

    setLoadFlag: dispatch.issuesFetch.setLoadFlag,
    setLoadRepos: dispatch.issuesFetch.setLoadRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Actions));
