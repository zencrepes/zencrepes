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
        const { milestone, setStageFlag, setVerifFlag, setMilestones, setAction, setVerifying, setOnSuccess, updateView } = this.props;
        setMilestones([milestone]);
        setOnSuccess(updateView);
        setAction('delete');
        setVerifying(true);
        setStageFlag(true);
        setVerifFlag(true);
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
    verifiedRepos: PropTypes.array.isRequired,
    repos: PropTypes.array.isRequired,
    milestone: PropTypes.object.isRequired,

    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setMilestones: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedRepos: state.milestonesCreate.verifiedRepos,
    repos: state.milestonesCreate.repos,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setVerifying: dispatch.milestonesEdit.setVerifying,

    setMilestones: dispatch.milestonesEdit.setMilestones,
    setAction: dispatch.milestonesEdit.setAction,

    setOnSuccess: dispatch.milestonesEdit.setOnSuccess,

    updateView: dispatch.sprintsView.updateView,
});

export default connect(mapState, mapDispatch)(RemoveButton);
