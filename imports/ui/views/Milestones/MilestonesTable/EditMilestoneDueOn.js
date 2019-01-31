import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Input from '@material-ui/core/Input';

class EditMilestoneDueOn extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { setNewDueOn } = this.props;
        if (!event.target.value) {
            setNewDueOn(null);
        } else {
            setNewDueOn(event.target.value);
        }
    };

    render() {
        const { newDueOn } = this.props;
        let dueOn = newDueOn;
        if (dueOn === null) {
            dueOn = '';
        }
        return (
            <Input
                placeholder="Enter a due date"
                inputProps={{
                    'aria-label': 'Description',
                }}
                value={dueOn}
                onChange={this.handleChange}
            />
        );
    }
}

EditMilestoneDueOn.propTypes = {
    newDueOn: PropTypes.string,
    setNewDueOn: PropTypes.func.isRequired,
};

const mapState = state => ({
    newDueOn: state.milestonesEdit.newDueOn,
});

const mapDispatch = dispatch => ({
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
});

export default connect(mapState, mapDispatch)(EditMilestoneDueOn);