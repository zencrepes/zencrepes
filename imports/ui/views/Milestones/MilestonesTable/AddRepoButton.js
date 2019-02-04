import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import IconButton from '@material-ui/core/IconButton';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

class AddRepoButton extends Component {
    constructor (props) {
        super(props);
    }

    addRepo = () => {
        const {
            milestones,
            updateAvailableRepos,
            setOpenAddRepos,
            setAddReposSelected,
            setNewTitle,
            setNewDueOn,
            setNewState,
            setNewDescription,
        } = this.props;
        updateAvailableRepos(milestones);
        setNewTitle(milestones[0].title);
        setNewDueOn(milestones[0].dueOn);
        setNewState(milestones[0].state);
        setNewDescription(milestones[0].description);
        setAddReposSelected([]);
        setOpenAddRepos(true);
    };

    render() {
        const { milestones, reposCount } = this.props;
        if (milestones !== undefined && milestones.length < reposCount) {
            return (
                <IconButton onClick={this.addRepo} title="Add to Repositories">
                    <CreateNewFolderIcon />
                </IconButton>
            );
        } else {
            return null;
        }
    }
}

AddRepoButton.propTypes = {
    reposCount: PropTypes.number.isRequired,
    milestones: PropTypes.array,
    setOpenAddRepos: PropTypes.func.isRequired,
    setAddReposSelected: PropTypes.func.isRequired,
    updateAvailableRepos: PropTypes.func.isRequired,

    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setNewState: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
};

const mapState = state => ({
    reposCount: state.milestonesView.reposCount,
});

const mapDispatch = dispatch => ({
    //setMilestones: dispatch.milestonesEdit.setMilestones,
    setOpenAddRepos: dispatch.milestonesEdit.setOpenAddRepos,
    setAddReposSelected: dispatch.milestonesEdit.setAddReposSelected,
    updateAvailableRepos: dispatch.milestonesEdit.updateAvailableRepos,
    setNewTitle: dispatch.milestonesEdit.setNewTitle,
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
    setNewState: dispatch.milestonesEdit.setNewState,
    setNewDescription: dispatch.milestonesEdit.setNewDescription,
});

export default connect(mapState, mapDispatch)(AddRepoButton);
