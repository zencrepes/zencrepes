import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';

const styles = {
    button: {
        marginLeft: '10px',
    },
};

class CloseSprint extends Component {
    constructor (props) {
        super(props);
    }

    closeSprint = () => {
        const { milestones, setStageFlag, setVerifFlag, setMilestones, setAction, setOnSuccess, refreshSprints, setVerifying } = this.props;
        setOnSuccess(refreshSprints);
        setMilestones(milestones);
        setAction('close');
        setVerifying(true);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        const { classes, milestones } = this.props;

        if (milestones.length === 0) {
            return null;
        } else {
            return (
                <Button variant="contained" color="primary" className={classes.button} onClick={this.closeSprint}>
                    Close Sprint
                </Button>
            )
        }
    }
}

CloseSprint.propTypes = {
    classes: PropTypes.object.isRequired,

    loading: PropTypes.bool.isRequired,
    loadSuccess: PropTypes.bool.isRequired,
    loadedCount: PropTypes.number.isRequired,
    repositories: PropTypes.array.isRequired,
    milestones: PropTypes.array.isRequired,

    setStageFlag: PropTypes.func.isRequired,
    setVerifFlag: PropTypes.func.isRequired,
    setVerifying: PropTypes.func.isRequired,
    setMilestones: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
    setLoadedCount: PropTypes.func.isRequired,
    setOnSuccess: PropTypes.func.isRequired,
    updateAvailableSprints: PropTypes.func.isRequired,
    updateSelectedSprint: PropTypes.func.isRequired,
    refreshSprints: PropTypes.func.isRequired,
};

const mapState = state => ({
    loading: state.milestonesEdit.loading,
    loadSuccess: state.milestonesEdit.loadSuccess,
    loadedCount: state.milestonesEdit.loadedCount,
    repositories: state.sprintsView.repositories,
    milestones: state.sprintsView.milestones,
});

const mapDispatch = dispatch => ({
    setStageFlag: dispatch.milestonesEdit.setStageFlag,
    setVerifFlag: dispatch.milestonesEdit.setVerifFlag,
    setVerifying: dispatch.milestonesEdit.setVerifying,

    setMilestones: dispatch.milestonesEdit.setMilestones,
    setAction: dispatch.milestonesEdit.setAction,

    setLoadedCount: dispatch.milestonesEdit.setLoadedCount,

    setOnSuccess: dispatch.milestonesEdit.setOnSuccess,

    updateAvailableSprints: dispatch.sprintsView.updateAvailableSprints,
    updateSelectedSprint: dispatch.sprintsView.updateSelectedSprint,
    refreshSprints: dispatch.sprintsView.refreshSprints,
});


export default connect(mapState, mapDispatch)(withStyles(styles)(CloseSprint));
