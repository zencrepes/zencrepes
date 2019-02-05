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
            labels,
            updateAvailableRepos,
            setOpenAddRepos,
            setAddReposSelected,
            setNewName,
            setNewDescription,
            setNewColor,
        } = this.props;
        updateAvailableRepos(labels);
        setNewName(labels[0].name);
        setNewDescription(labels[0].description);
        setNewColor(labels[0].color);
        setAddReposSelected([]);
        setOpenAddRepos(true);
    };

    render() {
        const { labels, reposCount } = this.props;
        if (labels !== undefined && labels.length < reposCount) {
            return (
                <Tooltip title="Add Label to repositories">
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
    labels: PropTypes.array,
    setOpenAddRepos: PropTypes.func.isRequired,
    setAddReposSelected: PropTypes.func.isRequired,
    updateAvailableRepos: PropTypes.func.isRequired,

    setNewName: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
    setNewColor: PropTypes.func.isRequired,
};

const mapState = state => ({
    reposCount: state.labelsView.reposCount,
});

const mapDispatch = dispatch => ({
    //setLabels: dispatch.labelsEdit.setLabels,
    setOpenAddRepos: dispatch.labelsEdit.setOpenAddRepos,
    setAddReposSelected: dispatch.labelsEdit.setAddReposSelected,
    updateAvailableRepos: dispatch.labelsEdit.updateAvailableRepos,
    setNewName: dispatch.labelsEdit.setNewName,
    setNewDescription: dispatch.labelsEdit.setNewDescription,
    setNewColor: dispatch.labelsEdit.setNewColor,
});

export default connect(mapState, mapDispatch)(AddRepoButton);
