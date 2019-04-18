import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class RefreshButton extends Component {
    constructor (props) {
        super(props);
    }

    edit = () => {
        const {
            setStageFlag,
            setVerifFlag,
            setIssues,
            setAction,
            issues,
            setOnSuccess,
            updateView
        } = this.props;
        setOnSuccess(updateView);
        setIssues(issues);
        setAction('refresh');
        setStageFlag(false);
        setVerifFlag(true);
    };

    render() {
        return (
            <Tooltip title="Refresh these issues only">
                <IconButton aria-label="Refresh" onClick={this.edit}>
                    <RefreshIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    }
}

RefreshButton.propTypes = {
    issues: PropTypes.array.isRequired,

    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setIssues: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,

    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    issues: state.projectView.issues,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.issuesEdit.setStageFlag,
    setVerifFlag: dispatch.issuesEdit.setVerifFlag,
    setIssues: dispatch.issuesEdit.setIssues,
    setAction: dispatch.issuesEdit.setAction,

    setOnSuccess: dispatch.loading.setOnSuccess,
    updateView: dispatch.projectView.updateView,
});

export default connect(mapState, mapDispatch)(RefreshButton);
