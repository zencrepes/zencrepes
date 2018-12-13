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

//import * as moment from 'moment';

const styles = theme => ({
    root: {
    }
});

class SprintDueDate extends Component {
    constructor (props) {
        super(props);
    }

    changeSprintEndDate = name => event => {
        const { setEditSprintDueDate } = this.props;
        console.log(event.target.value);
        let newSprintEndDate = null;
        try {
            var moment = require('moment');
            newSprintEndDate = moment(event.target.value, "YYYY-MM-DD").toISOString();
        }
        catch (error) {
            console.log(error);
        }
        console.log(newSprintEndDate);
        setEditSprintDueDate(newSprintEndDate);
    };

    render() {
        const { classes, editSprintDueDate } = this.props;
        console.log(editSprintDueDate);
        let endDate = new Date(editSprintDueDate);
        console.log(endDate);
        let formattedSprintEndDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1 < 10 ? '0' : '') + (endDate.getMonth()+1) + "-" + (endDate.getDate() < 10 ? '0' : '') + (endDate.getDate());
        return (
            <div className={classes.root}>
                <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    defaultValue={formattedSprintEndDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={this.changeSprintEndDate()}
                />
            </div>
        );
    };
}

SprintDueDate.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    setEditSprintDueDate: dispatch.sprintsView.setEditSprintDueDate,
});

const mapState = state => ({
    editSprintDueDate: state.sprintsView.editSprintDueDate,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SprintDueDate));