import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import {connect} from "react-redux";

class RemoveButton extends Component {
    constructor (props) {
        super(props);
    }

    remove = () => {
        const { project, setProjects, setAction, setOnSuccess, updateView, setStageFlag, setVerifFlag} = this.props;
        setProjects([project]);
        setAction('delete');
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        return (
            <Tooltip title="Remove Project from repositories">
                <IconButton aria-label="Delete" onClick={this.remove}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    }
}

RemoveButton.propTypes = {
    project: PropTypes.object.isRequired,

    setProjects: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.projectsEdit.setVerifFlag,
    setAction: dispatch.projectsEdit.setAction,
    setStageFlag: dispatch.projectsEdit.setStageFlag,
    updateView: dispatch.projectsView.updateView,
    setProjects: dispatch.projectsEdit.setProjects,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(RemoveButton);
