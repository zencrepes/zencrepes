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
import Staging from './Staging.js';

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
        const { classes, stageFlag, repos, milestoneTitle } = this.props;

        return (
            <div className={classes.root}>
                <Staging />
                <Dialog fullScreen aria-labelledby="simple-dialog-title" open={stageFlag}>
                    <DialogTitle id="simple-dialog-title">Review changes before pushing</DialogTitle>
                    <DialogContent>
                        <span>The following nodes will be modified in GitHub. Removing from this table will not push the change to GitHub for the removed node.</span><br />
                        <span>The system will verify each nodes in GitHub, applying changes will only be possible if local data is identical than GitHub's (based on last update date)</span>
                        <StageTable
                            repos={repos}
                            milestoneTitle={milestoneTitle}
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
    repos: PropTypes.array.isRequired,
    milestoneTitle: PropTypes.string.isRequired,

    setStageFlag: PropTypes.func.isRequired,
    setRepos: PropTypes.func.isRequired,
};

const mapState = state => ({
    stageFlag: state.milestonesCreate.stageFlag,
    repos: state.milestonesCreate.repos,
    milestoneTitle: state.milestonesCreate.milestoneTitle,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesCreate.setStageFlag,
    setRepos: dispatch.milestonesCreate.setRepos,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Stage));
