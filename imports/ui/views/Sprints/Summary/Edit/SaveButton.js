import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

const styles = theme => ({
    root: {

    },
});

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    save = () => {
        const {
            milestones,
            saveSprint,
            selectedSprintDescription,
            selectedSprintTitle,
            selectedSprintDueDate,

            editSprintTitle,
            editSprintDescription,
            editSprintDueDate,

            setStageFlag,
            setVerifFlag,
            setMilestones,
            setAction,
            setVerifying,
            setOnSuccess,
            updateView,
            setEditMilestoneTitle,
            setEditMilestoneDescription,
            setEditMilestoneDueDate,
        } = this.props;

        let hasChanged = false;
        if (selectedSprintDescription !== editSprintDescription) {hasChanged = true;}
        if (selectedSprintTitle !== editSprintTitle) {hasChanged = true;}
        if (selectedSprintDueDate !== editSprintDueDate) {hasChanged = true;}
        if (milestones.length > 0 && hasChanged === true) {
            //TODO - To be implemented
            console.log('Some milestones need to be changed, pending implementation');
            setMilestones(milestones);
            setEditMilestoneTitle(editSprintTitle);
            setEditMilestoneDescription(editSprintDescription);
            setEditMilestoneDueDate(editSprintDueDate);
            setOnSuccess(updateView);
            setAction('update');
            setVerifying(true);
            setStageFlag(true);
            setVerifFlag(true);
        } else {
            console.log('Nothing has changed or no repo in sprint');
        }
        saveSprint();
    };

    render() {
        const { classes } = this.props;

        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button onClick={this.save} color="primary" autoFocus>
                Save
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    milestones: state.sprintsView.milestones,

    selectedSprintDescription: state.sprintsView.selectedSprintDescription,
    selectedSprintTitle: state.sprintsView.selectedSprintTitle,
    selectedSprintDueDate: state.sprintsView.selectedSprintDueDate,

    editSprintTitle: state.sprintsView.editSprintTitle,
    editSprintDescription: state.sprintsView.editSprintDescription,
    editSprintDueDate: state.sprintsView.editSprintDueDate,

});

const mapDispatch = dispatch => ({
    saveSprint: dispatch.sprintsView.saveSprint,

    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setVerifying: dispatch.milestonesEdit.setVerifying,

    setMilestones: dispatch.milestonesEdit.setMilestones,
    setAction: dispatch.milestonesEdit.setAction,

    setEditMilestoneTitle: dispatch.milestonesEdit.setEditMilestoneTitle,
    setEditMilestoneDescription: dispatch.milestonesEdit.setEditMilestoneDescription,
    setEditMilestoneDueDate: dispatch.milestonesEdit.setEditMilestoneDueDate,

    setOnSuccess: dispatch.milestonesEdit.setOnSuccess,

    updateView: dispatch.sprintsView.updateView,


});

export default connect(mapState, mapDispatch)(withStyles(styles)(ApplyButton));