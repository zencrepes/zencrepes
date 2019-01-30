import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Input from '@material-ui/core/Input';

class EditLabelDescription extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { setNewDescription } = this.props;
        if (!event.target.value) {
            setNewDescription(null);
        } else {
            setNewDescription(event.target.value);
        }
    };

    render() {
        const { newDescription } = this.props;
        let description = newDescription;
        if (description === null) {
            description = '';
        }
        return (
            <Input
                placeholder="Enter a description"
                inputProps={{
                    'aria-label': 'Description',
                }}
                value={description}
                onChange={this.handleChange}
            />
        );
    }
}

EditLabelDescription.propTypes = {
    newDescription: PropTypes.string,
    setNewDescription: PropTypes.func.isRequired,
};

const mapState = state => ({
    newDescription: state.labelsEdit.newDescription,
});

const mapDispatch = dispatch => ({
    setNewDescription: dispatch.labelsEdit.setNewDescription,
});

export default connect(mapState, mapDispatch)(EditLabelDescription);