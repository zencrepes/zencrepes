import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import IconButton from '@material-ui/core/IconButton';
import SignDirectionIcon from 'mdi-react/SignDirectionIcon';

class OpenMilestoneButton extends Component {
    constructor (props) {
        super(props);
    }

    addRepo = () => {
        const {
            milestones,
            updateAvailableRepos,
            setOpenAddRepos,
            setAddReposSelected,
            setNewName,
            setNewDescription,
            setNewColor,
        } = this.props;
        updateAvailableRepos(milestones);
        setNewName(milestones[0].name);
        setNewDescription(milestones[0].description);
        setNewColor(milestones[0].color);
        setAddReposSelected([]);
        setOpenAddRepos(true);
    };

    render() {
        const { milestones, reposCount } = this.props;
        if (milestones !== undefined && milestones.length > 0) {
            return (
                <IconButton onClick={this.addRepo} title="Open Milestones">
                    <SignDirectionIcon />
                </IconButton>
            );
        } else {
            return null;
        }
    }
}

OpenMilestoneButton.propTypes = {
    reposCount: PropTypes.number.isRequired,
    milestones: PropTypes.array,
    setOpenAddRepos: PropTypes.func.isRequired,
    setAddReposSelected: PropTypes.func.isRequired,
    updateAvailableRepos: PropTypes.func.isRequired,

    setNewName: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
    setNewColor: PropTypes.func.isRequired,
};

const mapState = state => ({
    reposCount: state.milestonesView.reposCount,
});

const mapDispatch = dispatch => ({
    //setMilestones: dispatch.milestonesEdit.setMilestones,
    setOpenAddRepos: dispatch.milestonesEdit.setOpenAddRepos,
    setAddReposSelected: dispatch.milestonesEdit.setAddReposSelected,
    updateAvailableRepos: dispatch.milestonesEdit.updateAvailableRepos,
    setNewName: dispatch.milestonesEdit.setNewName,
    setNewDescription: dispatch.milestonesEdit.setNewDescription,
    setNewColor: dispatch.milestonesEdit.setNewColor,
});

export default connect(mapState, mapDispatch)(OpenMilestoneButton);
