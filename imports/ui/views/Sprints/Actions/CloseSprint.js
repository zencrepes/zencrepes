import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

const styles = theme => ({
    button: {
        marginLeft: '10px',
    },
});

class CloseSprint extends Component {
    constructor (props) {
        super(props);
    }
/*
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loadSuccess, setLoadSuccess, loadedCount, setLoadedCount, updateAvailableSprints, updateSelectedSprint } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            //Set timer to actually set back success to false (and remove snackbar)
            setTimeout(() => {
                setLoadSuccess(false);
                setLoadedCount(0);
            }, 2000);
            if (loadedCount > 0) {
                updateAvailableSprints();
                updateSelectedSprint(null);
            }
        }
    };
*/
    closeSprint = () => {
        console.log('closeSprint');
        const { milestones, setStageFlag, setVerifFlag, setMilestones, setAction, setOnSuccess, updateAvailableSprints, setVerifying } = this.props;
        setOnSuccess(updateAvailableSprints);
        setMilestones(milestones);
        setAction('close');
        setVerifying(true);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        const { classes, loading, loadSuccess, loadedCount, milestones } = this.props;

        if (milestones.length === 0) {
            return null;
        } else {
            return (
                <Button variant="raised" color="primary" className={classes.button} onClick={this.closeSprint}>
                    Close Sprint
                </Button>
            )
        }
    };
}

CloseSprint.propTypes = {
    classes: PropTypes.object.isRequired,
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

    setOnSuccess: dispatch.milestonesEdit.setOnSuccess,

    updateAvailableSprints: dispatch.sprintsView.updateAvailableSprints,
    updateSelectedSprint: dispatch.sprintsView.updateSelectedSprint,
});


export default connect(mapState, mapDispatch)(withStyles(styles)(CloseSprint));
