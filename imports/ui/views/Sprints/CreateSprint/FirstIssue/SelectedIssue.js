import _ from 'lodash';

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
import {cfgIssues} from "../../../../data/Minimongo";

const styles = theme => ({
    root: {
    }
});

//Logic for typing frequency found here: https://gist.github.com/krambertech/76afec49d7508e89e028fce14894724c
class SelectedIssue extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, selectedIssue } = this.props;
        if (selectedIssue !== undefined && selectedIssue !== null) {
            return (
                <div className={classes.root}>
                    <b>Selected Issue: {selectedIssue.title + " (" + selectedIssue.org.login + "/" + selectedIssue.repo.name + "#"+ selectedIssue.number + ")"} </b>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <b>No issue selected </b>
                </div>
            );
        }
    };
}

SelectedIssue.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    selectedIssue: state.sprintsView.selectedIssue,

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(SelectedIssue));
