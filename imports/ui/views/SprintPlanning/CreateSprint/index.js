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

import FirstIssue from './FirstIssue/index.js';

const styles = theme => ({
    root: {
    }
});

class CreateSprint extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sprintName: '',
            sprintDate: '',
        };
    }

    close = () => {
        const { setOpenCreateSprint } = this.props;
        setOpenCreateSprint(false);
    };


    changeSprintName = name => event => {
        this.setState({
            'sprintName': event.target.value
        });
    };

    changeSprintDate = name => event => {
        this.setState({
            'sprintDate': event.target.value
        });
    };

    render() {
        const { classes, openCreateSprint } = this.props;
        if (openCreateSprint) {
            return (
                <Dialog aria-labelledby="simple-dialog-title" open={openCreateSprint}>
                    <DialogTitle id="simple-dialog-title">Create Sprint</DialogTitle>
                    <DialogContent className={classes.root}>
                        <TextField
                            id="full-width"
                            label="Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                            onChange={this.changeSprintName()}
                        />
                        <TextField
                            id="full-width"
                            label="End Date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                            onChange={this.changeSprintDate()}
                        />
                        <FirstIssue />
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

CreateSprint.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    openCreateSprint: state.sprintPlanning.openCreateSprint,
});

const mapDispatch = dispatch => ({
    setOpenCreateSprint: dispatch.sprintPlanning.setOpenCreateSprint,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(CreateSprint));
