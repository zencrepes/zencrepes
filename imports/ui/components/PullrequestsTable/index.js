import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import TablePaginationActions from './TablePaginationActions.js';
import Pullrequest from './Pullrequest.js';

import Header from './Header/index.js';

class PullrequestsTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25,
        };
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    render() {
        const { filteredPullrequests, pagination } = this.props;
        const { rowsPerPage, page } = this.state;

        let emptyRows = 0;
        let pullrequests = filteredPullrequests;
        if (pagination === true) {
            emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredPullrequests.length - page * rowsPerPage);
            pullrequests = filteredPullrequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
            if (pullrequests.length < rowsPerPage) {
                emptyRows = 0;
            }
        }

        return (
            <Table>
                <Header
                    filteredPullrequests={filteredPullrequests}
                />
                <TableBody>
                    {pullrequests.map(pullrequest => {
                        return (
                            <Pullrequest pullrequest={pullrequest} key={pullrequest.id} />
                        );
                    })}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 48 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                {pagination === true &&
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={3}
                                count={filteredPullrequests.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                }
            </Table>
        );
    }
}

PullrequestsTable.propTypes = {
    filteredPullrequests: PropTypes.array,
    pagination: PropTypes.bool,
};

export default PullrequestsTable;
