import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

class DueOn extends Component {
    constructor (props) {
        super(props);
    }

    changeMilestoneEndDate = (date) => {
        const { setNewDueOn } = this.props;
        if (date === null) {
            setNewDueOn(null);
        } else {
            setNewDueOn(date.toISOString());
        }
    };

    render() {
        const { newDueOn } = this.props;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    autoOk
                    variant="outlined"
                    label="Due On"
                    emptyLabel="Not Set"
                    clearable
                    value={newDueOn}
                    onChange={this.changeMilestoneEndDate}
                />
            </MuiPickersUtilsProvider>
        );
    }
}

DueOn.propTypes = {
    newDueOn: PropTypes.string,
    setNewDueOn: PropTypes.func.isRequired,
};

const mapState = state => ({
    newDueOn: state.milestonesEdit.newDueOn,
});

const mapDispatch = dispatch => ({
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
});

export default connect(mapState, mapDispatch)(DueOn);