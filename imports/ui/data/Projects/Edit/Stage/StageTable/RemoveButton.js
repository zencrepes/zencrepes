import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {connect} from "react-redux";

class RemoveButton extends Component {
    constructor (props) {
        super(props);
    }

    remove = () => {
        const { project, projects, setProjects, verifiedProjects, setVerifiedProjects } = this.props;
        setProjects(
            projects.filter(ms => ms.id !== project.id)
        );
        setVerifiedProjects(
            verifiedProjects.filter(ms => ms.id !== project.id)
        );
    };

    render() {
        return (
            <IconButton aria-label="Delete" onClick={this.remove}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        );
    }
}

RemoveButton.propTypes = {
    verifiedProjects: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,

    setProjects: PropTypes.func.isRequired,
    setVerifiedProjects: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedProjects: state.projectsEdit.verifiedProjects,
    projects: state.projectsEdit.projects,
});

const mapDispatch = dispatch => ({
    setProjects: dispatch.projectsEdit.setProjects,
    setVerifiedProjects: dispatch.projectsEdit.setVerifiedProjects,
});

export default connect(mapState, mapDispatch)(RemoveButton);
