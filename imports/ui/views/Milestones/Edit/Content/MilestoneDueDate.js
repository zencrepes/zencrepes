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
    }
});

class MilestoneDueDate extends Component {
    constructor (props) {
        super(props);
    }

    changeMilestoneEndDate = name => event => {
        const { setEditMilestoneDueDate } = this.props;
        console.log(event.target.value);
        let newMilestoneEndDate = null;
        try {
            var moment = require('moment');
            newMilestoneEndDate = moment(event.target.value, "YYYY-MM-DD").add(4, 'hours').toISOString();
        }
        catch (error) {
            console.log(error);
        }
        console.log(newMilestoneEndDate);
        setEditMilestoneDueDate(newMilestoneEndDate);
    };

    render() {
        const { classes, editMilestoneDueDate } = this.props;
        console.log(editMilestoneDueDate);
        let endDate = new Date(editMilestoneDueDate);
        console.log(endDate);
        const formattedMilestoneEndDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1 < 10 ? '0' : '') + (endDate.getMonth()+1) + "-" + (endDate.getDate() < 10 ? '0' : '') + (endDate.getDate());
        console.log(formattedMilestoneEndDate);
        return (
            <div className={classes.root}>
                <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    defaultValue={formattedMilestoneEndDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={this.changeMilestoneEndDate()}
                />
            </div>
        );
    };
}

MilestoneDueDate.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    setEditMilestoneDueDate: dispatch.milestonesEdit.setEditMilestoneDueDate,
});

const mapState = state => ({
    editMilestoneDueDate: state.milestonesEdit.editMilestoneDueDate,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(MilestoneDueDate));