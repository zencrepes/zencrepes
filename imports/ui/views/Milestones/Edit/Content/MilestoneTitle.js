import _ from 'lodash';

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
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

class MilestoneTitle extends Component {
    constructor (props) {
        super(props);
    }

    changeSprintName = name => event => {
        const { setEditMilestoneTitle } = this.props;
        setEditMilestoneTitle(event.target.value);
    };

    render() {
        const { classes, editMilestoneTitle } = this.props;

        return (
                <TextField
                    id="outlined-full-width"
                    label="Milestone Title"
                    style={{ margin: 8 }}
                    placeholder=""
                    fullWidth
                    value={editMilestoneTitle}
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

MilestoneTitle.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    setEditMilestoneTitle: dispatch.milestonesEdit.setEditMilestoneTitle,
});

const mapState = state => ({
    editMilestoneTitle: state.milestonesEdit.editMilestoneTitle,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(MilestoneTitle));