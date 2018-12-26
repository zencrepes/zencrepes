import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SimpleMDE from 'react-simplemde-editor';
import "simplemde/dist/simplemde.min.css";

class MilestoneDescription extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = value => {
        const { setEditMilestoneDescription } = this.props;
        setEditMilestoneDescription(value);
    };

    render() {
        const { classes, editMilestoneDescription } = this.props;
        return (
            <SimpleMDE
                id="milestoneDescriptionEdit"
                onChange={this.handleChange}
                className={classes.root}
                value={editMilestoneDescription}
                options={{
                    autofocus: true,
                    spellChecker: false,
                }}
            />
        );
    }
}

MilestoneDescription.propTypes = {
    setEditMilestoneDescription: PropTypes.func.isRequired,
    editMilestoneDescription: PropTypes.string.isRequired,
};

const mapDispatch = dispatch => ({
    setEditMilestoneDescription: dispatch.milestonesEdit.setEditMilestoneDescription,
});

const mapState = state => ({
    editMilestoneDescription: state.milestonesEdit.editMilestoneDescription,
});

export default connect(mapState, mapDispatch)(MilestoneDescription);
