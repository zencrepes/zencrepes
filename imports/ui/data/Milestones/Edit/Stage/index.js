import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import StageTable from './StageTable/index.js';

import ApplyButton from './ApplyButton.js';
import CancelButton from './CancelButton.js';
import Typography from "@material-ui/core/Typography/Typography";

const styles = {
    root: {
        width: '90%'
    },
};
class Stage extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const {
            classes,
            stageFlag,
            milestones,
            action,
            newTitle,
            newState,
            newDueOn,
        } = this.props;
        if (stageFlag === true) {
            return (
                <div className={classes.root}>
                    <Dialog fullScreen aria-labelledby="simple-dialog-title" open={stageFlag}>
                        <DialogTitle id="simple-dialog-title">Review changes</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" gutterBottom>
                                The following changes have been staged for modification. Changes are only submitting to GitHub once you click on Apply, you cannot go back after clicking.
                            </Typography>
                            <StageTable
                                milestones={milestones}
                                action={action}
                                newTitle={newTitle}
                                newState={newState}
                                newDueOn={newDueOn}
                            />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton />
                            {milestones.length > 0 &&
                                <ApplyButton />
                            }
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else {
            return null;
        }
    }
}

Stage.propTypes = {
    classes: PropTypes.object.isRequired,
    stageFlag: PropTypes.bool.isRequired,
    milestones: PropTypes.array.isRequired,
    action: PropTypes.string,

    setStageFlag: PropTypes.func.isRequired,
    setMilestones: PropTypes.func.isRequired,

    newTitle: PropTypes.string.isRequired,
    newState: PropTypes.string.isRequired,
    newDueOn: PropTypes.string.isRequired,
};

const mapState = state => ({
    stageFlag: state.milestonesEdit.stageFlag,
    milestones: state.milestonesEdit.milestones,
    action: state.milestonesEdit.action,

    newTitle: state.milestonesEdit.newTitle,
    newState: state.milestonesEdit.newState,
    newDueOn: state.milestonesEdit.newDueOn,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setMilestones: dispatch.milestonesEdit.setMilestones,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Stage));
