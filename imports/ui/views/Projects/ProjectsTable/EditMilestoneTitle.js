import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Input from '@material-ui/core/Input';

class EditProjectTitle extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { setNewTitle } = this.props;
        setNewTitle(event.target.value);
    };

    render() {
        const { newTitle } = this.props;
        return (
            <Input
                placeholder="Enter a title"
                inputProps={{
                    'aria-label': 'Description',
                }}
                value={newTitle}
                onChange={this.handleChange}
            />
        );
    }
}

EditProjectTitle.propTypes = {
    newTitle: PropTypes.string.isRequired,
    setNewTitle: PropTypes.func.isRequired,
};

const mapState = state => ({
    newTitle: state.projectsEdit.newTitle,
});

const mapDispatch = dispatch => ({
    setNewTitle: dispatch.projectsEdit.setNewTitle,
});

export default connect(mapState, mapDispatch)(EditProjectTitle);