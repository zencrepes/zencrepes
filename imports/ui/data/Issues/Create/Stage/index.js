import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Typography from '@material-ui/core/Typography';

import StageTable from './StageTable/index.js';

import ApplyButton from './ApplyButton.js';
import CancelButton from './CancelButton.js';

const styles = {
    root: {
        width: '90%'
    },
    table: {
        width: '50%',
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
            issues,
            verifiedIssues,
            action,
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
                                issues={verifiedIssues}
                                action={action}
                            />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton />
                            {issues.length > 0 &&
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
    issues: PropTypes.array.isRequired,
    verifiedIssues: PropTypes.array.isRequired,
    action: PropTypes.string,

    setStageFlag: PropTypes.func.isRequired,
    setIssues: PropTypes.func.isRequired,
};

const mapState = state => ({
    stageFlag: state.issuesCreate.stageFlag,
    issues: state.issuesCreate.issues,
    verifiedIssues: state.issuesCreate.verifiedIssues,
    action: state.issuesCreate.action,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.issuesCreate.setStageFlag,
    setIssues: dispatch.issuesCreate.setIssues,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Stage));
