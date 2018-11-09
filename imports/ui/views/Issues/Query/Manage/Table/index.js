import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import Query from './Query.js';

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
    table: {
//        height: '300px'
    },
});


class QueriesTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
        };
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };


    render() {
        const { classes, queries, facets, loadQuery, deleteQuery } = this.props;
        const { rowsPerPage, page } = this.state;

        return (
            <div className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="none"></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Filter</TableCell>
                            <TableCell padding="none"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {queries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(query => {
                            return (
                                <Query
                                  query={query}
                                  key={query._id}
                                  facets={facets}
                                  loadQuery={loadQuery}
                                  deleteQuery={deleteQuery}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

QueriesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueriesTable);
