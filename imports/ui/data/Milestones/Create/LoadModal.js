import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {connect} from "react-redux";

import Button from '@material-ui/core/Button';
import Snackbar from "@material-ui/core/Snackbar";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import LoadMessage from './LoadMessage.js';

const styles = theme => ({
    root: {
    },
});
class LoadModal extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, loading } = this.props;

        return (
            <div className={classes.root}>
                <Dialog aria-labelledby="simple-dialog-title" open={loading}>
                    <DialogTitle id="simple-dialog-title">Updating ...</DialogTitle>
                    <DialogContent>
                        <LoadMessage />
                    </DialogContent>
                </Dialog>
            </div>
        );
    };
}

LoadModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.milestonesCreate.loading,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadModal));
