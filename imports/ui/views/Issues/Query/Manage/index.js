import React, { Component } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import QueriesTable from './Table/index.js';

class QueryManage extends Component {
    constructor (props) {
        super(props);
    }

    close = () => {
        const { setOpenManageQueryDialog } = this.props;
        setOpenManageQueryDialog(false);
    };

    render() {
        const { queries, facets, openManageQueryDialog, loadQuery, deleteQuery, timeFields } = this.props;
        if (openManageQueryDialog) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openManageQueryDialog} maxWidth="md">
                    <DialogTitle id="simple-dialog-title">Query Manager</DialogTitle>
                    <DialogContent>
                        <QueriesTable
                            queries={queries}
                            facets={facets}
                            timeFields={timeFields}
                            loadQuery={loadQuery}
                            deleteQuery={deleteQuery}
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
    }
}

QueryManage.propTypes = {
    queries: PropTypes.array.isRequired,
    facets: PropTypes.array.isRequired,
    timeFields: PropTypes.array.isRequired,
    openManageQueryDialog: PropTypes.bool.isRequired,
    loadQuery: PropTypes.func.isRequired,
    deleteQuery: PropTypes.func.isRequired,
    setOpenManageQueryDialog: PropTypes.func.isRequired,
};

export default QueryManage;
