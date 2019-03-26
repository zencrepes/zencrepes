import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import IconButton from '@material-ui/core/IconButton';
import CloseBoxIcon from 'mdi-react/CloseBoxIcon';
import Tooltip from '@material-ui/core/Tooltip';

class SetProjectClosedButton extends Component {
    constructor (props) {
        super(props);
    }

    closeProjects = () => {
        const {
            projects,
            setProjects,
            setAction,
            setVerifFlag,
            setStageFlag,
            setOnSuccess,
            setNewTitle,
            setNewDescription,
            setNewDueOn,
            setNewState,
            updateView,
        } = this.props;
        setProjects(projects);
        setNewTitle(projects[0].title);
        setNewDescription(projects[0].description);
        setNewDueOn(projects[0].dueOn);
        setNewState('closed');
        setAction('close');
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        const { projects } = this.props;
        if (projects !== undefined && projects.length > 0) {
            return (
                <Tooltip title="Close Projects">
                    <IconButton onClick={this.closeProjects} >
                        <CloseBoxIcon />
                    </IconButton>
                </Tooltip>
            );
        } else {
            return null;
        }
    }
}

SetProjectClosedButton.propTypes = {
    projects: PropTypes.array,

    setAction: PropTypes.func.isRequired,
    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setNewState: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setProjects: PropTypes.func.isRequired,

    updateView: PropTypes.func.isRequired,

    setOnSuccess: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setAction: dispatch.projectsEdit.setAction,
    setNewTitle: dispatch.projectsEdit.setNewTitle,
    setNewDueOn: dispatch.projectsEdit.setNewDueOn,
    setNewState: dispatch.projectsEdit.setNewState,
    setNewDescription: dispatch.projectsEdit.setNewDescription,
    setVerifFlag: dispatch.projectsEdit.setVerifFlag,
    setStageFlag: dispatch.projectsEdit.setStageFlag,
    setProjects: dispatch.projectsEdit.setProjects,

    updateView: dispatch.projectsView.updateView,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(SetProjectClosedButton);

