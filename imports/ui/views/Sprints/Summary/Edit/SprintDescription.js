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

class SprintDescription extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = value => {
        const { classes, setEditSprintDescription } = this.props;
        setEditSprintDescription(value);
    };

    render() {
        const { classes, editSprintDescription } = this.props;
        return (
            <SimpleMDE
                id="sprintDescriptionEdit"
                onChange={this.handleChange}
                className={classes.root}
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
    classes: PropTypes.object,
};

const mapDispatch = dispatch => ({
    setEditSprintDescription: dispatch.sprintsView.setEditSprintDescription,
});

const mapState = state => ({
    editSprintDescription: state.sprintsView.editSprintDescription,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SprintDescription));
