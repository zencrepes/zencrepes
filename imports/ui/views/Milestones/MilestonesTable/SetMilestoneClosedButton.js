import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';

class SetMilestoneClosedButton extends Component {
    constructor (props) {
        super(props);
    }

    addRepo = () => {
        /*
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
        setNewTitle(labels[0].name);
        setNewDueOn(labels[0].description);
        setNewColor(labels[0].color);
        setAddReposSelected([]);
        setOpenAddRepos(true);
        */
    };

    render() {
        const { milestones } = this.props;
//        console.log(milestones);
        if (milestones !== undefined && milestones.length > 0) {
            return (
                <IconButton onClick={this.addRepo} title="Close Milestones">
                    <CheckIcon />
                </IconButton>
            );
        } else {
            return null;
        }
    }
}

SetMilestoneClosedButton.propTypes = {
    reposCount: PropTypes.number.isRequired,
    milestones: PropTypes.array,
    setOpenAddRepos: PropTypes.func.isRequired,
    setAddReposSelected: PropTypes.func.isRequired,
    updateAvailableRepos: PropTypes.func.isRequired,

    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setNewState: PropTypes.func.isRequired,
};

const mapState = state => ({
    reposCount: state.milestonesView.reposCount,
});

const mapDispatch = dispatch => ({
    setOpenAddRepos: dispatch.milestonesEdit.setOpenAddRepos,
    setAddReposSelected: dispatch.milestonesEdit.setAddReposSelected,
    updateAvailableRepos: dispatch.milestonesEdit.updateAvailableRepos,
    setNewTitle: dispatch.milestonesEdit.setNewTitle,
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
    setNewState: dispatch.milestonesEdit.setNewState,
});

export default connect(mapState, mapDispatch)(SetMilestoneClosedButton);
