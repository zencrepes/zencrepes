import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class CancelButton extends Component {
    constructor (props) {
        super(props);
    }

    cancel = () => {
        const { setStageFlag, setMilestones, onCancel } = this.props;
        setMilestones([]);
        setStageFlag(false);
        onCancel();
    };

    render() {
        //The apply button is disabled until all milestones have been verified in GitHub and no errors have been found
        return (
            <Button
                variant="contained"
                color="primary"
                onClick={this.cancel}
            >
                Cancel
            </Button>
        );
    }
}

CancelButton.propTypes = {
    onCancel: PropTypes.func.isRequired,
    setStageFlag: PropTypes.func.isRequired,
    setMilestones: PropTypes.func.isRequired,
};

const mapState = state => ({
    onCancel: state.milestonesEdit.onCancel,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setMilestones: dispatch.milestonesEdit.setMilestones,
});

export default connect(mapState, mapDispatch)(CancelButton);