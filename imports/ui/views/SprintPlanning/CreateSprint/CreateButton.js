import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import FirstIssue from './FirstIssue/index.js';

const styles = theme => ({
    root: {
    }
});

class CreateButton extends Component {
    constructor (props) {
        super(props);
    }

    create = () => {
        const { setOpenCreateSprint, setLoadFlag, setRepos, setName, setEndDate } = this.props;

        setOpenCreateSprint(false);
        setRepos([selectedIssue.repo]);

    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Button onClick={this.create} color="primary" autoFocus>
                    Create
                </Button>
            </div>
        );
    };
}

CreateButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    selectedIssue: state.sprintPlanning.selectedIssue,

});

const mapDispatch = dispatch => ({
    setOpenCreateSprint: dispatch.sprintPlanning.setOpenCreateSprint,

    setLoadFlag: dispatch.githubCreateMilestones.setLoadFlag,
    setRepos: dispatch.githubCreateMilestones.setRepos,
    setName: dispatch.githubCreateMilestones.setName,
    setEndDate: dispatch.githubCreateMilestones.setEndDate,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(CreateButton));
