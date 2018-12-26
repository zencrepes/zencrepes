import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class MongoFilter extends Component {
    constructor (props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    openDialog = () => {
        this.setState({ open: true });
    };

    closeDialog = () => {
        this.setState({ open: false });
    };

    render() {
        const { query } = this.props;
        return (
            <div>
                <IconButton aria-label="Help" onClick={this.openDialog}>
                    <HelpIcon />
                </IconButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.closeDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Minimongo filter"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {JSON.stringify(query)}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

MongoFilter.propTypes = {
    query: PropTypes.object.isRequired,
};

export default MongoFilter;
