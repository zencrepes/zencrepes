import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Input from '@material-ui/core/Input';

class EditMilestoneTitle extends Component {
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

EditMilestoneTitle.propTypes = {
    newTitle: PropTypes.string.isRequired,
    setNewName: PropTypes.func.isRequired,
};

const mapState = state => ({
    newTitle: state.milestonesEdit.newTitle,
});

const mapDispatch = dispatch => ({
    setNewTitle: dispatch.milestonesEdit.setNewTitle,
});

export default connect(mapState, mapDispatch)(EditMilestoneTitle);