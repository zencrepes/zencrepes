import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import {connect} from "react-redux";

class EditButton extends Component {
    constructor (props) {
        super(props);
    }

    edit = () => {
        const {
            milestone,
            setMilestones,
            setAction,
            setOnSuccess,
            updateView,
            setOpenEditDialog,
            setNewTitle,
            setNewDueOn,
            setNewDescription,
        } = this.props;
        setMilestones([milestone]);
        setAction('update');
        setOnSuccess(updateView);
        setNewTitle(milestone.title);
        setNewDueOn(milestone.dueOn);
        setNewDescription(milestone.description);
        setOpenEditDialog(true);
    };

    render() {
        return (
            <IconButton aria-label="Delete" onClick={this.edit}>
                <EditIcon fontSize="small" />
            </IconButton>
        );
    }
}

EditButton.propTypes = {
    milestone: PropTypes.object.isRequired,

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
    setAction: dispatch.milestonesEdit.setAction,
    updateView: dispatch.milestonesView.updateView,
    setMilestones: dispatch.milestonesEdit.setMilestones,
    setOpenEditDialog: dispatch.milestonesEdit.setOpenEditDialog,

    setNewTitle: dispatch.milestonesEdit.setNewTitle,
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
    setNewDescription: dispatch.milestonesEdit.setNewDescription,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(EditButton);
