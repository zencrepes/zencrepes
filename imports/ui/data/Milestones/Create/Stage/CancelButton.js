import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class CancelButton extends Component {
    constructor (props) {
        super(props);
    }

    cancel = () => {
        const { setStageFlag, setRepos, onCancel } = this.props;
        setRepos([]);
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
    setStageFlag: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    setRepos: PropTypes.func.isRequired,
};

const mapState = state => ({
    onCancel: state.milestonesCreate.onCancel,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesCreate.setStageFlag,
    setRepos: dispatch.milestonesCreate.setRepos,
});

export default connect(mapState, mapDispatch)(CancelButton);