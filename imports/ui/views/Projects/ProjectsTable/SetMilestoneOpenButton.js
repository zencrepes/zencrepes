import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import SignDirectionIcon from 'mdi-react/SignDirectionIcon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class SetProjectOpenButton extends Component {
    constructor (props) {
        super(props);
    }

    openProjects = () => {
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
        setNewState('open');
        setAction('open');
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        const { projects } = this.props;
//        console.log(projects);
        if (projects !== undefined && projects.length > 0) {
            return (
                <Tooltip title="Open Projects">
                    <IconButton onClick={this.openProjects} >
                        <SignDirectionIcon />
                    </IconButton>
                </Tooltip>
            );
        } else {
            return null;
        }
    }
}

SetProjectOpenButton.propTypes = {
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

export default connect(null, mapDispatch)(SetProjectOpenButton);

