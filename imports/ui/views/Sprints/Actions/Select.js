import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
        width: '200px',
    },
    textField: {
        width: '200px',
    }
});

class Select extends Component {
    constructor(props) {
        super(props);
    }

    /*
    componentDidMount() {
        console.log('Sprint Planning - componentDidMount');
        const { sprints, updateAvailableSprints } = this.props;
        if (sprints.length === 0) {
            updateAvailableSprints();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('Sprint Planning - componentDidUpdate');
        const { updateView, loadSuccess } = this.props;
        if (prevProps.loadSuccess === false && loadSuccess === true) {
            updateView();
        }
    }
*/
    handleChange = name => event => {
        const { updateSelectedSprint } = this.props;
        console.log('Dashboard - QueryPicker - handleChange');
        updateSelectedSprint(event.target.value);
    };

    render() {
        const { classes, selectedSprintName, sprints } = this.props;
        if (selectedSprintName === null) {
            return null
        } else {
            return (
                <TextField className={classes.root}
                           id="select-query"
                           select
                           label="Select an open sprint"
                           margin="dense"
                           variant="filled"
                           className={classes.textField}
                           value={selectedSprintName}
                           onChange={this.handleChange('sprint')}
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
};

const mapDispatch = dispatch => ({
    updateSelectedSprint: dispatch.sprintsView.updateSelectedSprint,
    updateAvailableSprints: dispatch.sprintsView.updateAvailableSprints,
    updateView: dispatch.sprintsView.updateView,
});

const mapState = state => ({
    selectedSprintName: state.sprintsView.selectedSprintTitle,
    sprints: state.sprintsView.sprints,
    loadSuccess: state.issuesFetch.loadSuccess,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Select));
