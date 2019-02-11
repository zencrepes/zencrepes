import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SimpleMDE from 'react-simplemde-editor';
import "simplemde/dist/simplemde.min.css";

class Description extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = value => {
        const { setNewDescription } = this.props;
        setNewDescription(value);
    };

    render() {
        const { newDescription } = this.props;
        return (
            <SimpleMDE
                id="sprintDescriptionEdit"
                onChange={this.handleChange}
                value={newDescription}
                options={{
                    autofocus: true,
                    spellChecker: false,
                }}
            />
        );
    }
}

Description.propTypes = {
    newDescription: PropTypes.string,
    setNewDescription: PropTypes.func.isRequired,
};

const mapState = state => ({
    newDescription: state.milestonesEdit.newDescription,
});

const mapDispatch = dispatch => ({
    setNewDescription: dispatch.milestonesEdit.setNewDescription,
});

export default connect(mapState, mapDispatch)(Description);
