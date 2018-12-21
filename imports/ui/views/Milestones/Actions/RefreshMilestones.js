import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import RefreshIcon from '@material-ui/icons/Refresh';

const styles = theme => ({
    root: {
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
});
class RefreshMilestones extends Component {
    constructor (props) {
        super(props);
    }

    refreshFull = () => {
        const { setStageFlag, setVerifFlag, setMilestones, setAction, milestones, setOnSuccess, updateView, setVerifying } = this.props;
        setMilestones(milestones);
        setAction('refresh');
        setVerifying(true);
        setVerifFlag(true);
        setOnSuccess(updateView);
    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="contained" color="primary" className={classes.button} onClick={this.refreshFull}>
                <RefreshIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Milestones
            </Button>
        )
    };
}

RefreshMilestones.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setVerifying: dispatch.milestonesEdit.setVerifying,

    setMilestones: dispatch.milestonesEdit.setMilestones,
    setAction: dispatch.milestonesEdit.setAction,
    setOnSuccess: dispatch.milestonesEdit.setOnSuccess,

    updateView: dispatch.milestonesView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(RefreshMilestones));
