import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import QueriesTable from './QueriesTable.js';

const styles = theme => ({
    root: {
    }
});

class QueryManager extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    close = () => {
        const { setOpenQueryManager } = this.props;
        setOpenQueryManager(false);
    };

    render() {
        const { classes, openQueryManager } = this.props;
        console.log('QueryManager - render()');
        if (openQueryManager) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openQueryManager}>
                    <DialogTitle id="simple-dialog-title">Query Manager</DialogTitle>
                    <DialogContent>
                        <QueriesTable />
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

QueryManager.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    openQueryManager: state.queries.openQueryManager,
});

const mapDispatch = dispatch => ({
    setOpenQueryManager: dispatch.queries.setOpenQueryManager,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(QueryManager));
