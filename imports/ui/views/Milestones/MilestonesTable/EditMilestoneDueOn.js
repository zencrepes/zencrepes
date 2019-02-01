import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Input from '@material-ui/core/Input';
import TextField from "@material-ui/core/TextField/TextField";

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
        const { value } = this.props;
        let dueOn = new Date();
        if (value !== undefined) {
            dueOn = new Date(value[0].dueOn);
        }
        const formattedDueOn = dueOn.getFullYear() + "-" + (dueOn.getMonth()+1 < 10 ? '0' : '') + (dueOn.getMonth()+1) + "-" + (dueOn.getDate() < 10 ? '0' : '') + (dueOn.getDate());
        return (
            <TextField
                id="date"
                type="date"
                defaultValue={formattedDueOn}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleChange}
            />
        );
    }
}

EditMilestoneDueOn.propTypes = {
    value: PropTypes.array,
    setNewDueOn: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    setNewDueOn: dispatch.milestonesEdit.setNewDueOn,
});

export default connect(null, mapDispatch)(EditMilestoneDueOn);