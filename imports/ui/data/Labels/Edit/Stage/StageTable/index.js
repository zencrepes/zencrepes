import React, { Component } from 'react';

import PropTypes from 'prop-types';

import SquareIcon from 'mdi-react/SquareIcon';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Typography from '@material-ui/core/Typography';

import RemoveButton from './RemoveButton.js';
import VerifState from './VerifState.js';

import green from "@material-ui/core/colors/green";
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
    labelTitle: {
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
        const { classes, labels, action } = this.props;
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
                                Label Name
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Color
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Description
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Issues Count
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
                        {labels.map(label => {
                            return (
                                <TableRow key={label.id}>
                                    <TableCell component="th" scope="row">
                                        {action}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {label.org.login}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {label.repo.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <a href={label.url} className={classes.labelTitle} rel="noopener noreferrer" target="_blank">{label.name} <OpenInNewIcon style={{ fontSize: 12 }} /></a>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body1" gutterBottom>
                                            <SquareIcon color={'#' + label.color} /> ({'#' + label.color})
                                        </Typography>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {label.description}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {label.issues.totalCount}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <VerifState
                                            label={label}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <RemoveButton
                                            label={label}
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
    labels: PropTypes.array.isRequired,
    action: PropTypes.string.isRequired,
};

export default withStyles(styles)(StageTable);
