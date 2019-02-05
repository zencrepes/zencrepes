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
        const { milestone, setMilestones, setAction, setOnSuccess, updateView, setStageFlag, setVerifFlag} = this.props;
        setMilestones([milestone]);
        setAction('delete');
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        return (
            <Tooltip title="Remove Milestone from repositories">
                <IconButton aria-label="Delete" onClick={this.remove}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    }
}

RemoveButton.propTypes = {
    milestone: PropTypes.object.isRequired,

    setMilestones: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedRepos: state.milestonesCreate.verifiedRepos,
    repos: state.milestonesCreate.repos,
});

const mapDispatch = dispatch => ({
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setAction: dispatch.milestonesEdit.setAction,
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setMilestones: dispatch.milestonesEdit.setMilestones,

    setOnSuccess: dispatch.loading.setOnSuccess,

    updateView: dispatch.sprintsView.updateView,
});

export default connect(mapState, mapDispatch)(RemoveButton);
