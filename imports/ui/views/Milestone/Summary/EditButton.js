import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class EditButton extends Component {
    constructor (props) {
        super(props);
    }

    edit = () => {
        const {
            milestones,
            setMilestones,
            setAction,
            setOnSuccess,
            updateView,
            setOpenEditDialog,
            setNewTitle,
            setNewDueOn,
            setNewDescription,
        } = this.props;
        setMilestones(milestones);
        setAction('update');
        setOnSuccess(updateView);
        setNewTitle(milestones[0].title);
        setNewDueOn(milestones[0].dueOn);
        setNewDescription(milestones[0].description);
        setOpenEditDialog(true);
    };

    render() {
        return (
            <Tooltip title="Edit milestone title, description, due date">
                <IconButton aria-label="Edit" onClick={this.edit}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    }
}

EditButton.propTypes = {
    milestones: PropTypes.array.isRequired,

    setMilestones: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setOpenEditDialog: PropTypes.func.isRequired,

    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    updateView: dispatch.milestoneView.updateView,

    setAction: dispatch.milestonesEdit.setAction,
    setMilestones: dispatch.milestonesEdit.setMilestones,
    setOpenEditDialog: dispatch.milestonesEdit.setOpenEditDialog,

    setNewTitle: dispatch.milestonesEdit.setNewTitle,
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
    setNewDescription: dispatch.milestonesEdit.setNewDescription,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(EditButton);
