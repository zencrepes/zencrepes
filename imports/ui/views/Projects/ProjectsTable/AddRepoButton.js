import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

class AddRepoButton extends Component {
    constructor (props) {
        super(props);
    }

    addRepo = () => {
        const {
            projects,
            updateAvailableRepos,
            setOpenAddRepos,
            setAddReposSelected,
            setNewTitle,
            setNewDueOn,
            setNewState,
            setNewDescription,
        } = this.props;
        updateAvailableRepos(projects);
        setNewTitle(projects[0].title);
        setNewDueOn(projects[0].dueOn);
        setNewState(projects[0].state);
        setNewDescription(projects[0].description);
        setAddReposSelected([]);
        setOpenAddRepos(true);
    };

    render() {
        const { projects, reposCount } = this.props;
        if (projects !== undefined && projects.length < reposCount) {
            return (
                <Tooltip title="Add Project to repositories">
                    <IconButton onClick={this.addRepo}>
                        <CreateNewFolderIcon />
                    </IconButton>
                </Tooltip>
            );
        } else {
            return null;
        }
    }
}

AddRepoButton.propTypes = {
    reposCount: PropTypes.number.isRequired,
    projects: PropTypes.array,
    setOpenAddRepos: PropTypes.func.isRequired,
    setAddReposSelected: PropTypes.func.isRequired,
    updateAvailableRepos: PropTypes.func.isRequired,

    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setNewState: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
};

const mapState = state => ({
    reposCount: state.projectsView.reposCount,
});

const mapDispatch = dispatch => ({
    //setProjects: dispatch.projectsEdit.setProjects,
    setOpenAddRepos: dispatch.projectsEdit.setOpenAddRepos,
    setAddReposSelected: dispatch.projectsEdit.setAddReposSelected,
    updateAvailableRepos: dispatch.projectsEdit.updateAvailableRepos,
    setNewTitle: dispatch.projectsEdit.setNewTitle,
    setNewDueOn: dispatch.projectsEdit.setNewDueOn,
    setNewState: dispatch.projectsEdit.setNewState,
    setNewDescription: dispatch.projectsEdit.setNewDescription,
});

export default connect(mapState, mapDispatch)(AddRepoButton);
