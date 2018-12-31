import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = {
    root: {
        width: '200px',
    },
    textField: {
        width: '200px',
    }
};

class Select extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { updateSelectedSprint } = this.props;
        updateSelectedSprint(event.target.value);
    };

    render() {
        const { classes, selectedSprintName, sprints } = this.props;
        if (selectedSprintName === null) {
            return null
        } else {
            return (
                <TextField
                   id="select-query"
                   select
                   label="Select an open sprint"
                   margin="dense"
                   variant="filled"
                   className={classes.textField}
                   value={selectedSprintName}
                   onChange={this.handleChange}
                >
                    {sprints.map(sprintTitle => (
                        <MenuItem key={sprintTitle} value={sprintTitle}>
                            {sprintTitle}
                        </MenuItem>
                    ))}
                </TextField>
            );
        }
    }
}

Select.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedSprintName: PropTypes.string.isRequired,
    sprints: PropTypes.array.isRequired,
    loadSuccess: PropTypes.bool.isRequired,
    updateSelectedSprint: PropTypes.func.isRequired,
    updateAvailableSprints: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    selectedSprintName: state.sprintsView.selectedSprintTitle,
    sprints: state.sprintsView.sprints,
    loadSuccess: state.issuesFetch.loadSuccess,
});

const mapDispatch = dispatch => ({
    updateSelectedSprint: dispatch.sprintsView.updateSelectedSprint,
    updateAvailableSprints: dispatch.sprintsView.updateAvailableSprints,
    updateView: dispatch.sprintsView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Select));
