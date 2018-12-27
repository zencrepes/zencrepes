import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";
import classNames from 'classnames';

import Button from '@material-ui/core/Button';

import RefreshIcon from '@material-ui/icons/Refresh';

class RefreshIssues extends Component {
    constructor (props) {
        super(props);
    }

    refreshFull = () => {
        const { setStageFlag, setVerifFlag, setIssues, setAction, issues, setOnSuccess, updateView, setVerifying } = this.props;
        setIssues(issues);
        setAction('refresh');
        setStageFlag(true);
        setVerifying(true);
        setVerifFlag(true);
        setOnSuccess(updateView);
    };

    render() {
        return (
            <Button variant="contained" color="primary" className={classes.button} onClick={this.refreshFull}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Issues
            </Button>
        )
    };
}

RefreshIssues.propTypes = {
    issues: PropTypes.array.isRequired,

    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setIssues: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    issues: state.sprintsView.issues,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.issuesEdit.setStageFlag,
    setVerifFlag: dispatch.issuesEdit.setVerifFlag,
    setVerifying: dispatch.issuesEdit.setVerifying,

    setIssues: dispatch.issuesEdit.setIssues,
    setAction: dispatch.issuesEdit.setAction,
    setOnSuccess: dispatch.issuesEdit.setOnSuccess,

    updateView: dispatch.sprintsView.updateView,
});

export default connect(mapState, mapDispatch)(RefreshIssues);
