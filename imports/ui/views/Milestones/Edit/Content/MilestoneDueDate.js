import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';

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
        const { editMilestoneDueDate } = this.props;
        console.log(editMilestoneDueDate);
        let endDate = new Date(editMilestoneDueDate);
        console.log(endDate);
        const formattedMilestoneEndDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1 < 10 ? '0' : '') + (endDate.getMonth()+1) + "-" + (endDate.getDate() < 10 ? '0' : '') + (endDate.getDate());
        console.log(formattedMilestoneEndDate);
        return (
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
        );
    }
}

MilestoneDueDate.propTypes = {
    editMilestoneDueDate: PropTypes.string.isRequired,
    setEditMilestoneDueDate: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setEditMilestoneDueDate: dispatch.milestonesEdit.setEditMilestoneDueDate,
});

const mapState = state => ({
    editMilestoneDueDate: state.milestonesEdit.editMilestoneDueDate,
});

export default connect(mapState, mapDispatch)(MilestoneDueDate);