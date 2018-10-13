import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import FirstIssue from './FirstIssue/index.js';

const styles = theme => ({
    root: {
    }
});

class CreateButton extends Component {
    constructor (props) {
        super(props);
    }

    create = () => {
        const { setOpenCreateSprint, selectedIssue, createSprintName, createSprintEndDate, setLoadFlag, setRepos, setMilestoneTitle, setMilestoneDueOn, sprintCreated, setCallBack } = this.props;
        if (selectedIssue !== null && createSprintName !== '' && createSprintEndDate !== '') {
            setRepos([selectedIssue.repo]);
            setMilestoneTitle(createSprintName);
            setMilestoneDueOn(createSprintEndDate + 'T12:00:00Z'); //Format: YYYY-MM-DDTHH:MM:SSZ

            setLoadFlag(true);
            setOpenCreateSprint(false);
        } else {
            console.log('Unable to create sprint, verify all fields were completed');
        }

    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Button onClick={this.create} color="primary" autoFocus>
                    Create
                </Button>
            </div>
        );
    };
}

CreateButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    selectedIssue: state.sprintsView.selectedIssue,
    createSprintName: state.sprintsView.createSprintName,
    createSprintEndDate: state.sprintsView.createSprintEndDate,
});

const mapDispatch = dispatch => ({
    setOpenCreateSprint: dispatch.sprintsView.setOpenCreateSprint,
    sprintCreated: dispatch.sprintsView.sprintCreated,

    setLoadFlag: dispatch.milestonesEdit.setLoadFlag,
    setRepos: dispatch.milestonesEdit.setRepos,
    setMilestoneTitle: dispatch.milestonesEdit.setMilestoneTitle,
    setMilestoneDueOn: dispatch.milestonesEdit.setMilestoneDueOn,
    setMilestoneDueOn: dispatch.milestonesEdit.setCallBack
});

export default connect(mapState, mapDispatch)(withStyles(styles)(CreateButton));
