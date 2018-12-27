import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import MagnifyIcon from 'mdi-react/MagnifyIcon';

class SearchAssignees extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = name => event => {
        const { updateAvailableAssigneesFilter } = this.props;
        updateAvailableAssigneesFilter(event.target.value);
    };

    render() {
        const { availableAssigneesFilter } = this.props;
        return (
            <TextField
                label="Search"
                id="simple-start-adornment"
                value={availableAssigneesFilter}
                onChange={this.handleChange('name')}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><MagnifyIcon /></InputAdornment>,
                }}
            />
        );
    }
}

SearchAssignees.propTypes = {
    classes: PropTypes.object.isRequired,
    availableAssigneesFilter: PropTypes.array.isRequired,
    updateAvailableAssigneesFilter: PropTypes.func.isRequired,
};

const mapState = state => ({
    availableAssigneesFilter: state.sprintsView.availableAssigneesFilter,
});

const mapDispatch = dispatch => ({
    updateAvailableAssigneesFilter: dispatch.sprintsView.updateAvailableAssigneesFilter
});

export default connect(mapState, mapDispatch)(SearchAssignees);