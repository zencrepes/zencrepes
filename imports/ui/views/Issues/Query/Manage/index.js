import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import QueriesTable from './Table/index.js';

const styles = theme => ({
    root: {
    }
});

class QueryManage extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    close = () => {
        const { setOpenManageQueryDialog } = this.props;
        setOpenManageQueryDialog(false);
    };

    render() {
        const { classes, queries, openManageQueryDialog, loadQuery, deleteQuery } = this.props;
        if (openManageQueryDialog) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openManageQueryDialog} maxWidth="lg">
                    <DialogTitle id="simple-dialog-title">Query Manager</DialogTitle>
                    <DialogContent>
                        <QueriesTable
                            queries={queries}
                        />
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

    };
}

QueryManage.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(QueryManage);
