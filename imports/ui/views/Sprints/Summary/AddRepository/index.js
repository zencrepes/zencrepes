import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";

import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox from 'react-dual-listbox';

const styles = theme => ({
    button: {
        marginLeft: '10px',
    },
});

class AddRepository extends Component {
    constructor (props) {
        super(props);
    }

    cancel = () => {
        console.log('Cancel');
        const { setOpenAddRepository } = this.props;
        setOpenAddRepository(false);
    };

    apply = () => {
        console.log('apply');

        const {
            setOpenAddRepository,
            addReposAvailable,
            addReposSelected,
            allRepos,
            setStageFlag,
            setVerifFlag,
            setMilestones,
            setAction,
            setVerifying,
            setRepos,
            setMilestoneTitle,
            setMilestoneDescription,
            setMilestoneDueDate,
            selectedSprintTitle,
            selectedSprintDescription,
            selectedSprintDueDate,
            setOnSuccess,
            updateView,
        } = this.props;

        setOpenAddRepository(false);

        const selectedRepos = addReposSelected.map((r) => {
            const repoFound = allRepos.filter(repo => r === repo.id);
            return repoFound[0];
        });
        setRepos(selectedRepos);
        setMilestoneTitle(selectedSprintTitle);
        setMilestoneDescription(selectedSprintDescription);
        setMilestoneDueDate(selectedSprintDueDate);
        console.log(updateView);
        setOnSuccess(updateView);
        setVerifying(true);
        setStageFlag(true);
        setVerifFlag(true);
    };

    render() {
        const { classes, openAddRepository, addReposAvailable, addReposSelected, addRepoUpdateSelected } = this.props;

        if (openAddRepository) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openAddRepository}>
                    <DialogTitle id="simple-dialog-title">Add Repository</DialogTitle>
                    <DialogContent>
                        <DualListBox
                            canFilter
                            options={addReposAvailable}
                            selected={addReposSelected}
                            onChange={(selected) => {
                                addRepoUpdateSelected(selected);
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.cancel} color="primary" autoFocus>
                            Cancel
                        </Button>
                        <Button onClick={this.apply} color="primary" autoFocus>
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            return null;
        }
    };
}

AddRepository.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    openAddRepository: state.sprintsView.openAddRepository,
    addReposAvailable: state.sprintsView.addReposAvailable,
    addReposSelected: state.sprintsView.addReposSelected,
    allRepos: state.sprintsView.allRepos,

    selectedSprintTitle: state.sprintsView.selectedSprintTitle,
    selectedSprintDescription: state.sprintsView.selectedSprintDescription,
    selectedSprintDueDate: state.sprintsView.selectedSprintDueDate,

});

const mapDispatch = dispatch => ({
    setOpenAddRepository: dispatch.sprintsView.setOpenAddRepository,
    addRepoUpdateSelected: dispatch.sprintsView.addRepoUpdateSelected,

    setStageFlag: dispatch.milestonesCreate.setStageFlag,
    setVerifFlag: dispatch.milestonesCreate.setVerifFlag,
    setVerifying: dispatch.milestonesCreate.setVerifying,

    setRepos: dispatch.milestonesCreate.setRepos,

    setMilestoneTitle: dispatch.milestonesCreate.setMilestoneTitle,
    setMilestoneDescription: dispatch.milestonesCreate.setMilestoneDescription,
    setMilestoneDueDate: dispatch.milestonesCreate.setMilestoneDueDate,

    setOnSuccess: dispatch.milestonesCreate.setOnSuccess,

    updateView: dispatch.sprintsView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(AddRepository));
