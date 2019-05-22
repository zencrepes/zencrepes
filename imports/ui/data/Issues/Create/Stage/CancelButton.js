import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {connect} from "react-redux";

class CancelButton extends Component {
    constructor (props) {
        super(props);
    }

    cancel = () => {
        const { setStageFlag, setIssues, setLoading, onCancel } = this.props;
        setIssues([]);
        setStageFlag(false);
        setLoading(false);
        onCancel();
    };

    render() {
        //The apply button is disabled until all labels have been verified in GitHub and no errors have been found
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
    setIssues: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
};

const mapState = state => ({
    onCancel: state.loading.onCancel,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.issuesCreate.setStageFlag,
    setIssues: dispatch.issuesCreate.setIssues,
    setLoading: dispatch.loading.setLoading,
});

export default connect(mapState, mapDispatch)(CancelButton);