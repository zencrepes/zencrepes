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
            queryName: '',
        };
    }

    cancel = () => {
        const { setOpenSaveQuery } = this.props;
        setOpenSaveQuery(false);
    };

    save = () => {
        const { setOpenSaveQuery, filters, mongoFilters } = this.props;
        const { queryName } = this.state;

        // Search within minmongo for a query with the same name
        console.log(queryName);
        //setOpenSaveQuery(false);
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { classes, openSaveQuery } = this.props;
        console.log('QueryManager - render()');
        if (openSaveQuery) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openSaveQuery}>
                    <DialogTitle id="simple-dialog-title">Save Query</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="full-width"
                            label="Query Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            helperText="Pick name for your query"
                            fullWidth
                            margin="normal"
                            onChange={this.handleChange('queryName')}
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
    mongoFilters: state.data.mongoFilters,
});

const mapDispatch = dispatch => ({
    setOpenSaveQuery: dispatch.queries.setOpenSaveQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SaveQuery));
