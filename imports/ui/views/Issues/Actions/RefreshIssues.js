import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import RefreshIcon from '@material-ui/icons/Refresh';

const styles = theme => ({
    root: {
    },
});
class RefreshIssues extends Component {
    constructor (props) {
        super(props);
    }

    refreshFull = () => {
        const { setStageFlag, setVerifFlag, setIssues, setAction, issues, setOnSuccess, updateView } = this.props;
        setIssues(issues);
        setAction('refresh');
        setStageFlag(true);
        setVerifFlag(true);
        setOnSuccess(updateView);
    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="raised" color="primary" className={classes.button} onClick={this.refreshFull}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Issues
            </Button>
        )
    };
}

RefreshIssues.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    issues: state.issuesView.issues,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.issuesEdit.setStageFlag,
    setVerifFlag: dispatch.issuesEdit.setVerifFlag,

    setIssues: dispatch.issuesEdit.setIssues,
    setAction: dispatch.issuesEdit.setAction,
    setOnSuccess: dispatch.issuesEdit.setOnSuccess,

    updateView: dispatch.issuesView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(RefreshIssues));
