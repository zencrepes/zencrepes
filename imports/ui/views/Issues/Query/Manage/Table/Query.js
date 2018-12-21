import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Delete from './Delete.js';
import Open from './Open.js';

import Filters from '../../Filters/index.js';
import Grid from "@material-ui/core/Grid/Grid";

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class Query extends Component {
    constructor (props) {
        super(props);
    }

    openQuery = () => {
        const { query, loadQuery } = this.props;
        loadQuery(query);
    };

    deleteQuery = () => {
        const { query, deleteQuery } = this.props;
        deleteQuery(query);
    };

    render() {
        const { classes, query, facets, loadQuery } = this.props;

        return (
            <TableRow>
                <TableCell padding="none"><Open onClick={this.openQuery} /></TableCell>
                <TableCell scope="row">
                    {query.name}
                </TableCell>
                <TableCell>
                    <Filters
                        query={JSON.parse(query.filters)}
                        facets={facets}
                        updateQuery={null}
                    />
                </TableCell>
                <TableCell padding="none"><Delete onClick={this.deleteQuery} /></TableCell>
            </TableRow>
        );
    }
}

Query.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Query);
