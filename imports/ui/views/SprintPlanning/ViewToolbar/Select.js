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

    handleChange = name => event => {
        const { updateSprint } = this.props;
        console.log('Dashboard - QueryPicker - handleChange');
        updateSprint(event.target.value);
    };

    getSprints = () => {
        //{"milestone.title":{"$in":["HCMI - Sprint 10"]}}
        //let openedIssuesFilter = {...mongoSelector, ...{'state':{$in:['OPEN']}}};
        let milestonesGroup = Object.keys(_.groupBy(cfgIssues.find({'milestone.state':{'$in':['OPEN']}}).fetch(), 'milestone.title'));
        //console.log(milestonesGroup);
        return milestonesGroup;
    };

    render() {
        const { classes, sprintName } = this.props;
        let sprints = this.getSprints();
        return (
            <div className={classes.root}>
                <TextField
                    id="select-query"
                    select
                    label="Select an open sprint"
                    className={classes.textField}
                    value={sprintName}
                    onChange={this.handleChange('sprint')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {sprints.map(query => (
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
    setSprintName: dispatch.sprintPlanning.setSprintName,
    updateSprint: dispatch.sprintPlanning.updateSprint,
});

const mapState = state => ({
    sprintName: state.sprintPlanning.sprintName,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Select));
//export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTable));
