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

class SelectMilestone extends Component {
    constructor(props) {
        super(props);
    }

    updateSelectedSprint = (milestoneId) => {
        const { query } = this.props;
        // Update Query to new sprint title
        let updatedQuery = {...query};
        if (milestoneId === 'no-filter' && updatedQuery['milestone.id'] !== undefined) {
            delete updatedQuery['milestone.id'];
        } else {
            updatedQuery['milestone.id'] = {'$eq': milestoneId};
        }

        this.props.history.push({
            pathname: '/milestone',
            search: '?q=' + encodeURIComponent(JSON.stringify(updatedQuery)),
            state: { detail: updatedQuery }
        });
    };

    handleChange = (event) => {
        const { setSelectedMilestoneId } = this.props;
        this.updateSelectedSprint(event.target.value);
        setSelectedMilestoneId(event.target.value);
    };

    render() {
        const { classes, milestones, selectedMilestoneId } = this.props;
        return (
            <Select
                value={selectedMilestoneId}
                onChange={this.handleChange}
                className={classes.selectedField}
                inputProps={{
                    name: 'milestone',
                    id: 'milestone-simple',
                }}
            >
                {milestones.map(ms => (
                    <MenuItem key={ms.name} value={ms.id}>
                        {ms.name}
                    </MenuItem>
                ))}
            </Select>
        );
    }
}

SelectMilestone.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedMilestoneId: PropTypes.string,
    milestones: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    setSelectedMilestoneId: PropTypes.func.isRequired,
    query: PropTypes.object,
};

const mapState = state => ({
    selectedMilestoneId: state.milestoneView.selectedMilestoneId,
    milestones: state.milestoneView.milestones,
    query: state.milestoneView.query,
});

const mapDispatch = dispatch => ({
    setSelectedMilestoneId: dispatch.milestoneView.setSelectedMilestoneId,
});

export default withRouter(connect(mapState, mapDispatch)(withStyles(styles)(SelectMilestone)));

