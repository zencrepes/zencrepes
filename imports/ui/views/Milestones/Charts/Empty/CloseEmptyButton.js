import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});
class ClosedEmptyButton extends Component {
    constructor (props) {
        super(props);
    }

    deleteClosedEmpty = () => {
        console.log('deleteClosedEmpty');
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
        const { classes } = this.props;
        return (
            <Button variant="contained" color="primary" className={classes.button} onClick={this.deleteClosedEmpty}>
                Delete Empty
            </Button>
        );
    };
}

ClosedEmptyButton.propTypes = {
    classes: PropTypes.object.isRequired,
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

export default connect(mapState, mapDispatch)(withStyles(styles)(ClosedEmptyButton));
