import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class ApplyButton extends Component {
    constructor (props) {
        super(props);
    }

    apply = () => {
        const { setLoadFlag, setStageFlag } = this.props;
        setStageFlag(false);
        setLoadFlag(true);
    };

    render() {
        const { verifiedMilestones, milestones } = this.props;

        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="contained"
                color="primary"
                disabled={verifiedMilestones.filter(milestone => milestone.error === false).length !== milestones.length}
                onClick={this.apply}
            >
                Apply
            </Button>
        );
    }
}

ApplyButton.propTypes = {
    verifiedMilestones: PropTypes.array.isRequired,
    milestones: PropTypes.array.isRequired,

    setLoadFlag: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
};

const mapState = state => ({
    verifiedMilestones: state.milestonesEdit.verifiedMilestones,
    milestones: state.milestonesEdit.milestones,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.milestonesEdit.setLoadFlag,
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
});

export default connect(mapState, mapDispatch)(ApplyButton);