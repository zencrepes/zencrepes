import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DeleteWarning extends Component {
    constructor(props) {
        super(props);
    }

    triggerLabelsDeletion = () => {
        const { setDeleteWarning, setAction, setLoadFlag } = this.props;
        setDeleteWarning(false);
        setAction('delete');
        setLoadFlag(true);
    };

    cancelLabelsDeletion = () => {
        const { setDeleteWarning } = this.props;
        setDeleteWarning(false);

    };

    render() {
        const { deleteWarning } = this.props;
        if (deleteWarning) {
            return (
                <div>
                    <Dialog
                        open={deleteWarning}
                        onClose={this.cancelLabelsDeletion}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Delete Labels"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You are about to request one or more labels to be delete from GitHub. Deleting a label will remove it from all issues and pull requests. <br />
                                This cannot be undone !
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.cancelLabelsDeletion} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.triggerLabelsDeletion} color="primary" autoFocus>
                                YES, Delete !
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else {
            return null;
        }

    }
}

DeleteWarning.propTypes = {
    deleteWarning: PropTypes.bool.isRequired,

    setDeleteWarning: PropTypes.func.isRequired,
    setLoadFlag: PropTypes.func.isRequired,
    setAction: PropTypes.func.isRequired,
};

const mapState = state => ({
    deleteWarning: state.labelsEdit.deleteWarning
});

const mapDispatch = dispatch => ({
    setDeleteWarning: dispatch.labelsEdit.setDeleteWarning,
    setLoadFlag: dispatch.labelsEdit.setLoadFlag,
    setAction: dispatch.labelsEdit.setAction,
});

export default connect(mapState, mapDispatch)(DeleteWarning);