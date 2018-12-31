import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';

class MilestoneDueDate extends Component {
    constructor (props) {
        super(props);
    }

    changeMilestoneEndDate = (event) => {
        const { setEditMilestoneDueDate, log } = this.props;
        let newMilestoneEndDate = null;
        try {
            var moment = require('moment');
            newMilestoneEndDate = moment(event.target.value, "YYYY-MM-DD").add(4, 'hours').toISOString();
        }
        catch (error) {
            log.warn(error);
        }
        setEditMilestoneDueDate(newMilestoneEndDate);
    };

    render() {
        const { editMilestoneDueDate } = this.props;
        let endDate = new Date(editMilestoneDueDate);
        const formattedMilestoneEndDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1 < 10 ? '0' : '') + (endDate.getMonth()+1) + "-" + (endDate.getDate() < 10 ? '0' : '') + (endDate.getDate());
        return (
            <TextField
                id="date"
                label="End Date"
                type="date"
                defaultValue={formattedMilestoneEndDate}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.changeMilestoneEndDate}
            />
        );
    }
}

MilestoneDueDate.propTypes = {
    editMilestoneDueDate: PropTypes.string.isRequired,
    setEditMilestoneDueDate: PropTypes.func.isRequired,

    log: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    setEditMilestoneDueDate: dispatch.milestonesEdit.setEditMilestoneDueDate,
});

const mapState = state => ({
    editMilestoneDueDate: state.milestonesEdit.editMilestoneDueDate,
    log: state.global.log,
});

export default connect(mapState, mapDispatch)(MilestoneDueDate);