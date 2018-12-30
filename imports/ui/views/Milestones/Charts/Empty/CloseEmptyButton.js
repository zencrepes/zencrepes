import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';

class ClosedEmptyButton extends Component {
    constructor (props) {
        super(props);
    }

    deleteClosedEmpty = () => {
        const { milestones, setStageFlag, setVerifFlag, setMilestones, setAction, setVerifying, setOnCancel, setOnSuccess, updateView } = this.props;
        setMilestones(milestones.filter(m => m.state.toLowerCase() === 'closed').filter(m => m.issues.totalCount === 0));
        setAction('delete');
        setVerifying(true);
        setStageFlag(true);
        setVerifFlag(true);
        setOnSuccess(updateView);
        setOnCancel(updateView);
    };

    render() {
        return (
            <Button variant="contained" color="primary" onClick={this.deleteClosedEmpty}>
                Delete Empty
            </Button>
        );
    }
}

ClosedEmptyButton.propTypes = {
    milestones: PropTypes.array.isRequired,

    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadSuccess: PropTypes.func.isRequired,
    setMilestones: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setLoadedCount: PropTypes.func.isRequired,
    setOnCancel: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setVerifying: dispatch.milestonesEdit.setVerifying,
    setLoading: dispatch.milestonesEdit.setLoading,
    setLoadSuccess: dispatch.milestonesEdit.setLoadSuccess,

    setMilestones: dispatch.milestonesEdit.setMilestones,
    setAction: dispatch.milestonesEdit.setAction,

    setLoadedCount: dispatch.milestonesEdit.setLoadedCount,

    setOnCancel: dispatch.milestonesEdit.setOnCancel,
    setOnSuccess: dispatch.milestonesEdit.setOnSuccess,

    updateView: dispatch.milestonesView.updateView,

});

export default connect(mapState, mapDispatch)(ClosedEmptyButton);
