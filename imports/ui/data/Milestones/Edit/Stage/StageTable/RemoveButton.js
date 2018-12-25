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
        const { milestone, milestones, setMilestones, verifiedMilestones, setVerifiedMilestones } = this.props;
        setMilestones(
            milestones.filter(ms => ms.id !== milestone.id)
        );
        setVerifiedMilestones(
            verifiedMilestones.filter(ms => ms.id !== milestone.id)
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
    verifiedMilestones: PropTypes.array.isRequired,
    milestones: PropTypes.array.isRequired,
    milestone: PropTypes.object.isRequired,

    setMilestones: PropTypes.func.isRequired,
    setVerifiedMilestones: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedMilestones: state.milestonesEdit.verifiedMilestones,
    milestones: state.milestonesEdit.milestones,
});

const mapDispatch = dispatch => ({
    setMilestones: dispatch.milestonesEdit.setMilestones,
    setVerifiedMilestones: dispatch.milestonesEdit.setVerifiedMilestones,
});

export default connect(mapState, mapDispatch)(RemoveButton);
