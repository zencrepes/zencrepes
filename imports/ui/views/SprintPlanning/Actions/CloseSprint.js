import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import {buildMongoSelector} from "../../../utils/mongo";

import {cfgIssues} from "../../../data/Minimongo";
import {cfgMilestones} from "../../../data/Minimongo";

import ProgressBar from "../../../components/Loading/Issues/ProgressBar";

const styles = theme => ({
    root: {
        textAlign: 'right'
    },
});
class CloseSprint extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

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

    closeSprint = () => {
        console.log('closeSprint');
        const { milestones, setLoadFlag, setMilestones, setAction } = this.props;
        setMilestones(milestones);
        setAction('close');
        setLoadFlag(true);
    };

    render() {
        const { classes, loading, loadSuccess, loadedCount, repositories } = this.props;

        if (repositories.length === 0) {
            return null;
        } else {
            return (
                <div className={classes.root}>
                    {!loading &&
                    <div>
                        <Button variant="raised" color="primary" className={classes.button} onClick={this.closeSprint}>
                            Close Sprint
                        </Button>
                    </div>
                    }
                    {loading &&
                    <ProgressBar/>
                    }
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        open={loadSuccess}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Updated {loadedCount} milestones</span>}
                    />
                </div>
            )
        }
    };
}

CloseSprint.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.githubCreateMilestones.loading,
    loadSuccess: state.githubCreateMilestones.loadSuccess,

    loadedCount: state.githubCreateMilestones.loadedCount,

    repositories: state.sprintPlanning.repositories,

    milestones: state.sprintPlanning.milestones,
});

const mapDispatch = dispatch => ({
    setLoadFlag: dispatch.githubCreateMilestones.setLoadFlag,
    setLoading: dispatch.githubCreateMilestones.setLoading,
    setLoadSuccess: dispatch.githubCreateMilestones.setLoadSuccess,

    setMilestones: dispatch.githubCreateMilestones.setMilestones,
    setAction: dispatch.githubCreateMilestones.setAction,

    setLoadedCount: dispatch.githubCreateMilestones.setLoadedCount,

    updateAvailableSprints: dispatch.sprintPlanning.updateAvailableSprints,
    updateSelectedSprint: dispatch.sprintPlanning.updateSelectedSprint,

});


export default connect(mapState, mapDispatch)(withStyles(styles)(CloseSprint));
