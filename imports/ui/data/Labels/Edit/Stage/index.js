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
        const { classes, stageFlag, labels, action, newName, newDescription, newColor } = this.props;
        return (
            <div className={classes.root}>
                <Dialog fullScreen aria-labelledby="simple-dialog-title" open={stageFlag}>
                    <DialogTitle id="simple-dialog-title">Review changes</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" gutterBottom>
                            The following changes have been staged for modification. Changes are only submitting to GitHub once you click on Apply, you cannot go back after clicking.
                        </Typography>
                        <StageTable
                            labels={labels}
                            action={action}
                            newName={newName}
                            newDescription={newDescription}
                            newColor={newColor}
                        />
                    </DialogContent>
                    <DialogActions>
                        <CancelButton />
                        <ApplyButton />
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Stage.propTypes = {
    classes: PropTypes.object.isRequired,
    stageFlag: PropTypes.bool.isRequired,
    labels: PropTypes.array.isRequired,
    action: PropTypes.string,

    setStageFlag: PropTypes.func.isRequired,
    setLabels: PropTypes.func.isRequired,

    newName: PropTypes.string.isRequired,
    newDescription: PropTypes.string,
    newColor: PropTypes.string.isRequired,
};

const mapState = state => ({
    stageFlag: state.labelsEdit.stageFlag,
    labels: state.labelsEdit.labels,
    action: state.labelsEdit.action,

    newName: state.labelsEdit.newName,
    newDescription: state.labelsEdit.newDescription,
    newColor: state.labelsEdit.newColor,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.labelsEdit.setStageFlag,
    setLabels: dispatch.labelsEdit.setLabels,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Stage));
