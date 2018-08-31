import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
    }
});

class LoadingAll extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes, loading, message } = this.props;
        if (loading) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={true}>
                    <DialogTitle id="simple-dialog-title">Loading ...</DialogTitle>
                    <DialogContent>
                        <div>
                            {message}
                        </div>
                    </DialogContent>
                </Dialog>
            );
        } else {
            return null;
        }
    }
}

LoadingAll.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loading: state.loading.loading,
    message: state.loading.message,
});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(LoadingAll));

