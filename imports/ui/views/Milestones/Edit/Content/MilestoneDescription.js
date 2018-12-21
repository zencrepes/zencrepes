import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from 'react-moment';
import ReactMarkdown from 'react-markdown';

import SimpleMDE from 'react-simplemde-editor';
import "simplemde/dist/simplemde.min.css";

const styles = theme => ({
    root: {
    }
});

class MilestoneDescription extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = value => {
        const { classes, setEditMilestoneDescription } = this.props;
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
    classes: PropTypes.object,
};

const mapDispatch = dispatch => ({
    setEditMilestoneDescription: dispatch.milestonesEdit.setEditMilestoneDescription,
});

const mapState = state => ({
    editMilestoneDescription: state.milestonesEdit.editMilestoneDescription,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(MilestoneDescription));
