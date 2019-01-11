import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import SearchAssignees from './SearchAssignees';
import ListAssignees from './ListAssignees';

class AddAssignee extends Component {
    constructor (props) {
        super(props);
    }

    close = () => {
        const { setOpenAddAssignee } = this.props;
        setOpenAddAssignee(false);
    };

    render() {
        const { openAddAssignee } = this.props;
        if (openAddAssignee) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openAddAssignee}>
                    <DialogTitle id="simple-dialog-title">Add Team Member</DialogTitle>
                    <DialogContent>
                        <SearchAssignees />
                        <ListAssignees />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.close} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            return null;
        }
    }
}

AddAssignee.propTypes = {
    openAddAssignee: PropTypes.bool.isRequired,
    setOpenAddAssignee: PropTypes.func.isRequired,
};

const mapState = state => ({
    openAddAssignee: state.sprintsView.openAddAssignee,
});

const mapDispatch = dispatch => ({
    setOpenAddAssignee: dispatch.sprintsView.setOpenAddAssignee,
});

export default connect(mapState, mapDispatch)(AddAssignee);
