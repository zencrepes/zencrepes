import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import { cfgQueries } from '../../data/Queries.js';

const styles = theme => ({
    root: {
    },
    textField: {
        width: 400,
    },
});

class SaveQuery extends Component {
    constructor (props) {
        super(props);
        this.state = {
            queryNameValue: '',
            queryNameError: false,
            queryNameHelperText: 'Pick a name for your query',
        };
    }

    cancel = () => {
        const { setOpenSaveQuery } = this.props;
        setOpenSaveQuery(false);
    };

    save = () => {
        const { setOpenSaveQuery, filters } = this.props;
        const { queryNameValue } = this.state;

        // Search within minmongo for a query with the same name
        //console.log(queryName);
        if (!this.doesQueryNameExists(event.target.value)) {
            const queryId = cfgQueries.insert({
                name: queryNameValue,
                filters: JSON.stringify(filters),
            });

            console.log('Query ID: ' + queryId);
            setOpenSaveQuery(false);
        }
    };

    doesQueryNameExists = (name) => {
        if (cfgQueries.find({'name': {$eq: name}}).count() > 0) {
            console.log('changeQueryName - This query name already exists');
            return true;
        } else {
            console.log('changeQueryName - This query name does not exists');
            return false;
        }
    };

    changeQueryName = name => event => {
        console.log('changeQueryName');
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
        const { classes, openSaveQuery } = this.props;
        const { queryNameError, queryNameHelperText } = this.state;
        if (openSaveQuery) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openSaveQuery}>
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

    };
}

SaveQuery.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    openSaveQuery: state.queries.openSaveQuery,
    filters: state.data.filters,
});

const mapDispatch = dispatch => ({
    setOpenSaveQuery: dispatch.queries.setOpenSaveQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SaveQuery));
