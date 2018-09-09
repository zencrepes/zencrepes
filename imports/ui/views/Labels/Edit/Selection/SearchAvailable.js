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

class SearchAvailable extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleChange = name => event => {
        const { classes, updateAvailableFilter } = this.props;
        updateAvailableFilter(event.target.value);
    };

    render() {
        const { classes, availableFilter } = this.props;
        return (
            <TextField
                label="Search"
                id="simple-start-adornment"
                value={availableFilter}
                className={classNames(classes.margin, classes.textField)}
                onChange={this.handleChange('name')}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><MagnifyIcon /></InputAdornment>,
                }}
            />
        );
    }
}

SearchAvailable.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    availableFilter: state.labelsconfiguration.availableFilter,
});

const mapDispatch = dispatch => ({
    updateAvailableFilter: dispatch.labelsconfiguration.updateAvailableFilter
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SearchAvailable));