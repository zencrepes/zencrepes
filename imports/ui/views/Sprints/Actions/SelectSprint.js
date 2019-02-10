import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {withRouter} from "react-router-dom";

const styles = {
    selectedField: {
        color: '#fff',
        width: '300px',
    }
};

class SelectSprint extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        const { selectedSprintTitle, query } = this.props;
        if (prevProps.selectedSprintTitle === null && selectedSprintTitle !== null & query !== {}) {
            //View was initialized, we simply re-push the sprint title to trigger page load
            this.updateSprintTitle(selectedSprintTitle);
        }
    }

    updateSprintTitle = (sprintTitle) => {
        const { query } = this.props;
        // Update Query to new sprint title
        const updatedQuery = {...query, title: {'$in':[sprintTitle]}};
        this.props.history.push({
            pathname: '/sprints',
            search: '?q=' + JSON.stringify(updatedQuery),
            state: { detail: updatedQuery }
        });
    };

    handleChange = (event) => {
        this.updateSprintTitle(event.target.value);
    };

    render() {
        const { classes, selectedSprintTitle, sprints } = this.props;
        if (selectedSprintTitle === null) {
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
    history: PropTypes.object.isRequired,
    query: PropTypes.object,
};

const mapState = state => ({
    selectedSprintTitle: state.sprintsView.selectedSprintTitle,
    sprints: state.sprintsView.sprints,
    query: state.sprintsView.query,
});

export default withRouter(connect(mapState, null)(withStyles(styles)(SelectSprint)));

