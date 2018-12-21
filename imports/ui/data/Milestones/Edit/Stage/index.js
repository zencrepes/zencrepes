import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import StageTable from './StageTable/index.js';

import ApplyButton from './ApplyButton.js';
import CancelButton from './CancelButton.js';

const styles = theme => ({
    root: {
        width: '90%'
    },
});
class Stage extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, stageFlag, milestones, action } = this.props;

        return (
            <div className={classes.root}>
                <Dialog fullScreen aria-labelledby="simple-dialog-title" open={stageFlag}>
                    <DialogTitle id="simple-dialog-title">Review changes before pushing</DialogTitle>
                    <DialogContent>
                        <span>The following nodes will be modified in GitHub. Removing from this table will not push the change to GitHub for the removed node.</span><br />
                        <span>The system will verify each nodes in GitHub, applying changes will only be possible if local data is identical than GitHub's (based on last update date)</span>
                        <StageTable
                            milestones={milestones}
                            action={action}
                        />
                    </DialogContent>
                    <DialogActions>
                        <CancelButton />
                        <ApplyButton />
                    </DialogActions>
                </Dialog>
            </div>
        );
    };
}

Stage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    stageFlag: state.milestonesEdit.stageFlag,
    milestones: state.milestonesEdit.milestones,
    action: state.milestonesEdit.action,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setMilestones: dispatch.milestonesEdit.setMilestones,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Stage));
