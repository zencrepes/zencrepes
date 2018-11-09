import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import PropTypes from "prop-types";

import CloseSprint from './CloseSprint';
import Refresh from './Refresh';
import Select from './Select';
import Create from './Create';

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

    /*
    getAssignees = () => {
        const { sprintName } = this.props;
        let assigneesRepartition = getAssigneesRepartition(cfgIssues.find({'milestone.title':{'$in':[sprintName]}}).fetch());
        return assigneesRepartition;
    };
*/
    render() {
        const { classes, selectedSprintName, assignees } = this.props;
        //let assignees = getAssigneesRepartition(cfgIssues.find({'milestone.title':{'$in':[sprintName]}}).fetch());
        return (
            <div className={classes.root}>
                <AppBar position="static" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <div className={classes.toolbarButtons}>
                            <Select />
                            <Refresh />
                            <CloseSprint />
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

export default connect(mapState, null)(withStyles(styles)(Actions));
