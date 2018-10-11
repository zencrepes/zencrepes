import _ from 'lodash';

import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import { cfgIssues } from '../../../data/Minimongo.js';

const styles = theme => ({
    root: {
        //width: '100%',
        overflowX: 'auto',
        maxWidth: '200px'
    },
    textField: {
        width: '100%',
    },
    menu: {
        width: '100%',
    },
});

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {sprint: null};
    }

    componentDidMount() {
        console.log('Sprint Planning - componentDidMount');
        const { availableSprints, updateAvailableSprints } = this.props;
        if (availableSprints.length === 0) {
            updateAvailableSprints();
        }
    }
    
    componentDidUpdate() {
        console.log('Sprint Planning - componentDidUpdate');
        const { availableSprints, updateAvailableSprints } = this.props;
        if (availableSprints.length === 0) {
            updateAvailableSprints();
        }
    }

    handleChange = name => event => {
        const { updateSelectedSprint } = this.props;
        console.log('Dashboard - QueryPicker - handleChange');
        updateSelectedSprint(event.target.value);
    };

    render() {
        const { classes, selectedSprintName, availableSprints } = this.props;
        return (
            <div className={classes.root}>
                <TextField
                    id="select-query"
                    select
                    label="Select an open sprint"
                    className={classes.textField}
                    value={selectedSprintName}
                    onChange={this.handleChange('sprint')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {availableSprints.map(query => (
                        <MenuItem key={query} value={query}>
                            {query}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        );
    }
}

Select.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateSelectedSprint: dispatch.sprintPlanning.updateSelectedSprint,
    updateAvailableSprints: dispatch.sprintPlanning.updateAvailableSprints,
});

const mapState = state => ({
    selectedSprintName: state.sprintPlanning.selectedSprintName,
    availableSprints: state.sprintPlanning.availableSprints,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Select));
