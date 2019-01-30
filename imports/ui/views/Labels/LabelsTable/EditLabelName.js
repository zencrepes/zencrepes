import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Input from '@material-ui/core/Input';

class EditLabelName extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { setNewName } = this.props;
        setNewName(event.target.value);
    };

    render() {
        const { newName } = this.props;
        return (
            <Input
                placeholder="Enter a name"
                inputProps={{
                    'aria-label': 'Description',
                }}
                value={newName}
                onChange={this.handleChange}
            />
        );
    }
}

EditLabelName.propTypes = {
    newName: PropTypes.string.isRequired,
    setNewName: PropTypes.func.isRequired,
};

const mapState = state => ({
    newName: state.labelsEdit.newName,
});

const mapDispatch = dispatch => ({
    setNewName: dispatch.labelsEdit.setNewName,
});

export default connect(mapState, mapDispatch)(EditLabelName);