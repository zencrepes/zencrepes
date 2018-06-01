import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import { connect } from "react-redux";

import { cfgQueries } from '../../data/Queries.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },

});

class QuerySaved extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    };

    render() {
        const { classes, mongoFilters, openSaveQuery } = this.props;

        let foundQuery = cfgQueries.findOne({'mongo': {$eq: JSON.stringify(mongoFilters)}});
        if (foundQuery === undefined) {
            return (
                <h4>Query not saved</h4>
            );
        } else {
            return (
                <h4>Query Name: {foundQuery.name}</h4>
            );
        }
    }
}

QuerySaved.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});

const mapState = state => ({
    mongoFilters: state.data.mongoFilters,
    openSaveQuery: state.queries.openSaveQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(QuerySaved));