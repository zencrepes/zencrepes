import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Delete from './Delete.js';
import Open from './Open.js';

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
    }

    render() {
        const { classes, query, loadQuery } = this.props;

        return (
            <TableRow>
                <TableCell padding="none"><Open onClick={this.openQuery}/></TableCell>
                <TableCell scope="row">
                    {query.name}
                </TableCell>
                <TableCell>{query.filters}</TableCell>
                <TableCell padding="none"><Delete /></TableCell>
            </TableRow>
        );
    }
}

Query.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Query);
