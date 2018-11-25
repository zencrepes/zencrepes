import _ from 'lodash';

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

const styles = theme => ({
    root: {

    },
    textField: {
        width: '100%'
    }
});

class SprintTitle extends Component {
    constructor (props) {
        super(props);
    }

    changeSprintName = name => event => {
        const { setEditSprintTitle } = this.props;
        setEditSprintTitle(event.target.value);
    };

    render() {
        const { classes, editSprintTitle } = this.props;

        return (
                <TextField
                    id="outlined-full-width"
                    label="Sprint Title"
                    style={{ margin: 8 }}
                    placeholder=""
                    fullWidth
                    value={editSprintTitle}
                    onChange={this.changeSprintName()}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
        );
    };
}

SprintTitle.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    setEditSprintTitle: dispatch.sprintsView.setEditSprintTitle,
});

const mapState = state => ({
    editSprintTitle: state.sprintsView.editSprintTitle,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SprintTitle));