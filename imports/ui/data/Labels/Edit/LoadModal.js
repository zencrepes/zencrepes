import React, { Component } from 'react';

import PropTypes from 'prop-types';
import {connect} from "react-redux";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import LoadMessage from './LoadMessage.js';

class LoadModal extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { loading } = this.props;

        return (
            <Dialog aria-labelledby="simple-dialog-title" open={loading}>
                <DialogTitle id="simple-dialog-title">Updating ...</DialogTitle>
                <DialogContent>
                    <LoadMessage />
                </DialogContent>
            </Dialog>
        );
    }
}

LoadModal.propTypes = {
    loading: PropTypes.bool.isRequired,
};

const mapState = state => ({
    loading: state.labelsEdit.loading,
});

export default connect(mapState, null)(LoadModal);
