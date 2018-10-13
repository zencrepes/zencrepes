import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import MagnifyIcon from 'mdi-react/MagnifyIcon';

const styles = theme => ({

});

class SearchRepositories extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleChange = name => event => {
        const { classes, updateAvailableRepositoriesFilter } = this.props;
        updateAvailableRepositoriesFilter(event.target.value);
    };

    render() {
        const { classes, availableRepositoriesFilter } = this.props;
        return (
            <TextField
                label="Search"
                id="simple-start-adornment"
                value={availableRepositoriesFilter}
                className={classNames(classes.margin, classes.textField)}
                onChange={this.handleChange('name')}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><MagnifyIcon /></InputAdornment>,
                }}
            />
        );
    }
}

SearchRepositories.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    availableRepositoriesFilter: state.sprintsView.availableRepositoriesFilter,
});

const mapDispatch = dispatch => ({
    updateAvailableRepositoriesFilter: dispatch.sprintsView.updateAvailableRepositoriesFilter
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SearchRepositories));