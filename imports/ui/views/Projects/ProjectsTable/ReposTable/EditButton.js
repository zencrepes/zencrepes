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
            project,
            setProjects,
            setAction,
            setOnSuccess,
            updateView,
            setOpenEditDialog,
            setNewTitle,
            setNewDueOn,
            setNewDescription,
        } = this.props;
        setProjects([project]);
        setAction('update');
        setOnSuccess(updateView);
        setNewTitle(project.title);
        setNewDueOn(project.dueOn);
        setNewDescription(project.description);
        setOpenEditDialog(true);
    };

    render() {
        return (
            <IconButton aria-label="Edit" onClick={this.edit}>
                <EditIcon fontSize="small" />
            </IconButton>
        );
    }
}

EditButton.propTypes = {
    project: PropTypes.object.isRequired,

    setProjects: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setOpenEditDialog: PropTypes.func.isRequired,

    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setAction: dispatch.projectsEdit.setAction,
    updateView: dispatch.projectsView.updateView,
    setProjects: dispatch.projectsEdit.setProjects,
    setOpenEditDialog: dispatch.projectsEdit.setOpenEditDialog,

    setNewTitle: dispatch.projectsEdit.setNewTitle,
    setNewDueOn: dispatch.projectsEdit.setNewDueOn,
    setNewDescription: dispatch.projectsEdit.setNewDescription,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(EditButton);
