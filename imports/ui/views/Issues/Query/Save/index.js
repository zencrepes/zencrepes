import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

const styles = {
    textField: {
        width: 400,
    },
};

class QuerySave extends Component {
    constructor (props) {
        super(props);
        this.state = {
            queryNameValue: '',
            queryNameError: false,
            queryNameHelperText: 'Pick a name for your query',
        };
    }

    cancel = () => {
        const { setOpenSaveQueryDialog } = this.props;
        setOpenSaveQueryDialog(false);
    };

    save = () => {
        const { saveQuery, setOpenSaveQueryDialog } = this.props;
        const { queryNameValue } = this.state;

        // Search within minmongo for a query with the same name
        if (!this.doesQueryNameExists(event.target.value)) {
            saveQuery(queryNameValue);
            setOpenSaveQueryDialog(false);
        }
    };

    /*
     doesQueryNameExists(): Check if a query with the same name exists in the database
    */
    doesQueryNameExists = (name) => {
        const { queries } = this.props;
        if (queries.filter((query) => query.name === name).length > 0) {
            return true;
        } else {
            return false;
        }
    };

    changeQueryName = name => event => {
        //Search for existing query name
        if (this.doesQueryNameExists(event.target.value)) {
            this.setState({
                ['queryNameError']: true,
                ['queryNameHelperText']: 'A query with this name already exists',
            });
        } else {
            this.setState({
                ['queryNameError']: false,
                ['queryNameHelperText']: 'Pick a name for your query',
                ['queryNameValue']: event.target.value,
            });
        }
    };

    render() {
        const { classes, openSaveQueryDialog } = this.props;
        const { queryNameError, queryNameHelperText } = this.state;
        if (openSaveQueryDialog) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openSaveQueryDialog}>
                    <DialogTitle id="simple-dialog-title">Save Query</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="full-width"
                            label="Query Name"
                            error={queryNameError}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            helperText={queryNameHelperText}
                            fullWidth
                            margin="normal"
                            onChange={this.changeQueryName()}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.cancel} color="primary" autoFocus>
                            Cancel
                        </Button>
                        <Button onClick={this.save} color="primary" autoFocus>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        } else {
            return null;
        }
    }
};

QuerySave.propTypes = {
    classes: PropTypes.object.isRequired,
    setOpenSaveQueryDialog: PropTypes.func.isRequired,
    saveQuery: PropTypes.func.isRequired,
    queries: PropTypes.array.isRequired,
    openSaveQueryDialog: PropTypes.bool.isRequired,
};

export default withStyles(styles)(QuerySave);
