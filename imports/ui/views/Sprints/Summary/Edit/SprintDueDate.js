import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';

//import * as moment from 'moment';

class SprintDueDate extends Component {
    constructor (props) {
        super(props);
    }

    changeSprintEndDate = name => event => {
        const { setEditSprintDueDate, log } = this.props;
        let newSprintEndDate = null;
        try {
            var moment = require('moment');
            newSprintEndDate = moment(event.target.value, "YYYY-MM-DD").add(4, 'hours').toISOString();
        }
        catch (error) {
            log.warn(error);
        }
        setEditSprintDueDate(newSprintEndDate);
    };

    render() {
        const { editSprintDueDate } = this.props;
        let endDate = new Date(editSprintDueDate);
        let formattedSprintEndDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1 < 10 ? '0' : '') + (endDate.getMonth()+1) + "-" + (endDate.getDate() < 10 ? '0' : '') + (endDate.getDate());
        return (
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
        );
    }
}

SprintDueDate.propTypes = {
    editSprintDueDate: PropTypes.string.isRequired,
    setEditSprintDueDate: PropTypes.func.isRequired,
    log: PropTypes.object.isRequired,
};

const mapState = state => ({
    editSprintDueDate: state.sprintsView.editSprintDueDate,
    log: state.global.log,
});

const mapDispatch = dispatch => ({
    setEditSprintDueDate: dispatch.sprintsView.setEditSprintDueDate,
});

export default connect(mapState, mapDispatch)(SprintDueDate);