import _ from 'lodash';

import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

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
    }

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

    handleChange = name => event => {
        const { updateSelectedSprint } = this.props;
        console.log('Dashboard - QueryPicker - handleChange');
        updateSelectedSprint(event.target.value);
    };

    render() {
        const { classes, selectedSprintName, sprints } = this.props;
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
                    {sprints.map(sprintTitle => (
                        <MenuItem key={sprintTitle} value={sprintTitle}>
                            {sprintTitle}
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
