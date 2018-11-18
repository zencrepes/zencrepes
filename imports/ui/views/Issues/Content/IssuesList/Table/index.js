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

import TablePaginationActions from './TablePaginationActions.js';
import Issue from './Issue.js';

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


class IssuesTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 100,
        };
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };


    render() {
        const { classes, issues } = this.props;
        const { rowsPerPage, page } = this.state;

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, issues.length - page * rowsPerPage);

        return (
            <div className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>{issues.length} Issues</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(issue => {
                            return (
                                <Issue issue={issue} key={issue.id} />
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 48 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={3}
                                count={issues.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    }
}

IssuesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesTable));
