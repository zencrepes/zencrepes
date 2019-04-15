import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Query from './Query.js';

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
        const { queries, facets, loadQuery, deleteQuery, timeFields } = this.props;
        const { rowsPerPage, page } = this.state;

        return (
            <Table>
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
                              timeFields={timeFields}
                              loadQuery={loadQuery}
                              deleteQuery={deleteQuery}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
}

QueriesTable.propTypes = {
    queries: PropTypes.array.isRequired,
    facets: PropTypes.array.isRequired,
    timeFields: PropTypes.array.isRequired,
    loadQuery: PropTypes.func.isRequired,
    deleteQuery: PropTypes.func.isRequired,
};

export default QueriesTable;
