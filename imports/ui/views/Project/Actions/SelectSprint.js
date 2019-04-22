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

    updateSelectedSprint = (labelName) => {
        const { query } = this.props;
        // Update Query to new sprint title
        let updatedQuery = {...query};
        if(labelName === 'no-sprint' && updatedQuery['labels.edges'] !== undefined) {
            delete updatedQuery['labels.edges'];
        } else if (labelName !== 'no-sprint') {
            updatedQuery = {...query, 'labels.edges':{'$elemMatch':{'node.name':{'$in':[labelName]}}}};
        }
        //{"labels.edges":{"$elemMatch":{"node.name":{"$in":["loe:xx-large"]}}}}
        this.props.history.push({
            pathname: '/project',
            search: '?q=' + JSON.stringify(updatedQuery),
            state: { detail: updatedQuery }
        });
    };

    handleChange = (event) => {
        const { setSelectedSprintLabel } = this.props;
        this.updateSelectedSprint(event.target.value);
        setSelectedSprintLabel(event.target.value);
    };

    render() {
        const { classes, sprints, selectedSprintLabel } = this.props;
        return (
            <Select
                value={selectedSprintLabel}
                onChange={this.handleChange}
                className={classes.selectedField}
                inputProps={{
                    name: 'age',
                    id: 'age-simple',
                }}
            >
                <MenuItem key='no-sprint' value='no-sprint'>
                    No Sprint (unfiltered)
                </MenuItem>
                {sprints.map(sprint => (
                    <MenuItem key={sprint.name} value={sprint.name}>
                        {sprint.display}
                    </MenuItem>
                ))}
            </Select>
        );
        /*
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
        */
    }
}

SelectSprint.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedSprintLabel: PropTypes.string,
    sprints: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    setSelectedSprintLabel: PropTypes.func.isRequired,
    query: PropTypes.object,
};

const mapState = state => ({
    selectedSprintLabel: state.projectView.selectedSprintLabel,
    sprints: state.projectView.sprints,
    query: state.projectView.query,
});

const mapDispatch = dispatch => ({
    setSelectedSprintLabel: dispatch.projectView.setSelectedSprintLabel,
});

export default withRouter(connect(mapState, mapDispatch)(withStyles(styles)(SelectSprint)));

