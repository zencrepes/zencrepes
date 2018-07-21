import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import { cfgQueries } from '../../../data/Minimongo.js';

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
        const { classes, filters, openSaveQuery } = this.props;

        let foundQuery = cfgQueries.findOne({'filters': {$eq: JSON.stringify(filters)}});
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
    filters: state.queries.filters,
    openSaveQuery: state.queries.openSaveQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(QuerySaved));
