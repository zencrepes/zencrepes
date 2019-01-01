import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SimpleMDE from 'react-simplemde-editor';
import "simplemde/dist/simplemde.min.css";

class SprintDescription extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = value => {
        const { setEditSprintDescription } = this.props;
        setEditSprintDescription(value);
    };

    render() {
        const { editSprintDescription } = this.props;
        return (
            <SimpleMDE
                id="sprintDescriptionEdit"
                onChange={this.handleChange}
                value={editSprintDescription}
                options={{
                    autofocus: true,
                    spellChecker: false,
                }}
            />
        );
    }
}

SprintDescription.propTypes = {
    editSprintDescription: PropTypes.string.isRequired,
    setEditSprintDescription: PropTypes.func.isRequired,
};


const mapState = state => ({
    editSprintDescription: state.sprintsView.editSprintDescription,
});

const mapDispatch = dispatch => ({
    setEditSprintDescription: dispatch.sprintsView.setEditSprintDescription,
});

export default connect(mapState, mapDispatch)(SprintDescription);
