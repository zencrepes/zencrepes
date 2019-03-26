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
            projects,
            action,
            newTitle,
            newState,
            newDueOn,
            newDescription,
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
                                projects={projects}
                                action={action}
                                newTitle={newTitle}
                                newState={newState}
                                newDueOn={newDueOn}
                                newDescription={newDescription}
                            />
                        </DialogContent>
                        <DialogActions>
                            <CancelButton />
                            {projects.length > 0 &&
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
    projects: PropTypes.array.isRequired,
    action: PropTypes.string,

    setStageFlag: PropTypes.func.isRequired,
    setProjects: PropTypes.func.isRequired,

    newTitle: PropTypes.string.isRequired,
    newState: PropTypes.string.isRequired,
    newDueOn: PropTypes.string,
    newDescription: PropTypes.string,
};

const mapState = state => ({
    stageFlag: state.projectsEdit.stageFlag,
    projects: state.projectsEdit.projects,
    action: state.projectsEdit.action,

    newTitle: state.projectsEdit.newTitle,
    newState: state.projectsEdit.newState,
    newDueOn: state.projectsEdit.newDueOn,
    newDescription: state.projectsEdit.newDescription,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.projectsEdit.setStageFlag,
    setProjects: dispatch.projectsEdit.setProjects,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Stage));
