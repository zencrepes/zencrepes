import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import SignDirectionIcon from 'mdi-react/SignDirectionIcon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class SetMilestoneOpenButton extends Component {
    constructor (props) {
        super(props);
    }

    openMilestones = () => {
        const {
            milestones,
            setMilestones,
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
        setMilestones(milestones);
        setNewTitle(milestones[0].title);
        setNewDescription(milestones[0].description);
        setNewDueOn(milestones[0].dueOn);
        setNewState('open');
        setAction('open');
        setOnSuccess(updateView);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        const { milestones } = this.props;
//        console.log(milestones);
        if (milestones !== undefined && milestones.length > 0) {
            return (
                <Tooltip title="Open Milestones">
                    <IconButton onClick={this.openMilestones} >
                        <SignDirectionIcon />
                    </IconButton>
                </Tooltip>
            );
        } else {
            return null;
        }
    }
}

SetMilestoneOpenButton.propTypes = {
    milestones: PropTypes.array,

    setAction: PropTypes.func.isRequired,
    setNewTitle: PropTypes.func.isRequired,
    setNewDueOn: PropTypes.func.isRequired,
    setNewState: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setMilestones: PropTypes.func.isRequired,

    updateView: PropTypes.func.isRequired,

    setOnSuccess: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setAction: dispatch.milestonesEdit.setAction,
    setNewTitle: dispatch.milestonesEdit.setNewTitle,
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
    setNewState: dispatch.milestonesEdit.setNewState,
    setNewDescription: dispatch.milestonesEdit.setNewDescription,
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setMilestones: dispatch.milestonesEdit.setMilestones,

    updateView: dispatch.milestonesView.updateView,

    setOnSuccess: dispatch.loading.setOnSuccess,
});

export default connect(null, mapDispatch)(SetMilestoneOpenButton);

