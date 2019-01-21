import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import IconButton from '@material-ui/core/IconButton';
import CreateNewFolderIcon from '@material-ui/icons/createNewFolder';

class AddRepoButton extends Component {
    constructor (props) {
        super(props);
    }

    addRepo = () => {
        const { labels, updateAvailableRepos, setOpenAddRepos, setAddReposSelected } = this.props;
        updateAvailableRepos(labels);
        setAddReposSelected([]);
        setOpenAddRepos(true);
    };

    render() {
        return (
            <IconButton onClick={this.addRepo} title="Add to Repositories">
                <CreateNewFolderIcon />
            </IconButton>
        );
    }
}

AddRepoButton.propTypes = {
    labels: PropTypes.array.isRequired,
//    setLabels: PropTypes.func.isRequired,
    setOpenAddRepos: PropTypes.func.isRequired,
    setAddReposSelected: PropTypes.func.isRequired,
    updateAvailableRepos: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    //setLabels: dispatch.labelsEdit.setLabels,
    setOpenAddRepos: dispatch.labelsEdit.setOpenAddRepos,
    setAddReposSelected: dispatch.labelsEdit.setAddReposSelected,
    updateAvailableRepos: dispatch.labelsEdit.updateAvailableRepos
});

export default connect(null, mapDispatch)(AddRepoButton);
