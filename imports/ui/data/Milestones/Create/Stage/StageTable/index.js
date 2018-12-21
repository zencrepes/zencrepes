import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from "react-redux";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import RemoveButton from './RemoveButton.js';
import VerifState from './VerifState.js';

import green from "@material-ui/core/colors/green";
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import red from "@material-ui/core/colors/red";


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
    milestoneTitle: {
        fontSize: '1rm',
        color: '#000000!important',
        textDecoration: "none",
    },
    iconVerified: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: green[800],
    },
    iconError: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: red[800],
    },

});

class StageTable extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, repos, milestoneTitle } = this.props;
        return (
            <div className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Action
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Organization
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Repository
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Title
                            </TableCell>
                            <TableCell component="th" scope="row">
                                GitHub Verified
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Remove
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {repos.map(repo => {
                            return (
                                <TableRow key={repo.id}>
                                    <TableCell component="th" scope="row">
                                        CREATE
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {repo.org.login}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <a href={repo.url} className={classes.milestoneTitle} target="_blank">{repo.name} <OpenInNewIcon style={{ fontSize: 12 }} /></a>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {milestoneTitle}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <VerifState
                                            repo={repo}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <RemoveButton
                                            repo={repo}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

StageTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StageTable);
