import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const styles = {
    selectedField: {
        color: '#fff',
    }
};

class SelectSprint extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event) => {
        const { updateSelectedSprint } = this.props;
        updateSelectedSprint(event.target.value);
    };

    render() {
        const { classes, selectedSprintTitle, sprints } = this.props;
        if (selectedSprintTitle === '' || selectedSprintTitle === null || selectedSprintTitle === undefined) {
            return null
        } else {
            return (
                <Select
                    value={selectedSprintTitle}
                    onChange={this.handleChange}
                    className={classes.selectedField}
                    inputProps={{
                        name: 'age',
                        id: 'age-simple',
                    }}
                >
                    {sprints.map(sprintTitle => (
                        <MenuItem key={sprintTitle} value={sprintTitle}>
                            {sprintTitle}
                        </MenuItem>
                    ))}
                </Select>
            );
        }
    }
}

SelectSprint.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedSprintTitle: PropTypes.string,
    sprints: PropTypes.array.isRequired,
    loadSuccess: PropTypes.bool.isRequired,
    updateSelectedSprint: PropTypes.func.isRequired,
    updateAvailableSprints: PropTypes.func.isRequired,
    updateView: PropTypes.func.isRequired,
};

const mapState = state => ({
    selectedSprintTitle: state.sprintsView.selectedSprintTitle,
    sprints: state.sprintsView.sprints,
    loadSuccess: state.issuesFetch.loadSuccess,
});

const mapDispatch = dispatch => ({
    updateSelectedSprint: dispatch.sprintsView.updateSelectedSprint,
    updateAvailableSprints: dispatch.sprintsView.updateAvailableSprints,
    updateView: dispatch.sprintsView.updateView,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SelectSprint));
