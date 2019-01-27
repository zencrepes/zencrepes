import React, { Component } from 'react';

import PropTypes from 'prop-types';

import SquareIcon from 'mdi-react/SquareIcon';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import RemoveButton from './RemoveButton.js';

import RepoLink from '../../../../components/Common/RepoLink/index.js';
import OrgLink from '../../../../components/Common/OrgLink/index.js';
import LabelLink from '../../../../components/Common/LabelLink/index.js';

const styles = {
    table: {
        width: '70%'
    },
    labelTitle: {
        fontSize: '1rm',
        color: '#000000!important',
        textDecoration: "none",
    }
};

class ReposTable extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, labels  } = this.props;
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell component="th" scope="row">
                        </TableCell>
                        <TableCell component="th" scope="row">
                            Name
                        </TableCell>
                        <TableCell component="th" scope="row">
                            Organization
                        </TableCell>
                        <TableCell component="th" scope="row">
                            Repository
                        </TableCell>
                        <TableCell component="th" scope="row">
                            Color
                        </TableCell>
                        <TableCell component="th" scope="row">
                            Description
                        </TableCell>
                        <TableCell component="th" scope="row">
                            Issues
                        </TableCell>
                        <TableCell component="th" scope="row">
                            PRs
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {labels.map(label => {
                        return (
                            <TableRow key={label.id}>
                                <TableCell component="th" scope="row">
                                    <RemoveButton
                                        label={label}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <LabelLink
                                        label={label}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <OrgLink
                                        org={label.org}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <RepoLink
                                        repo={label.repo}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" gutterBottom>
                                        <SquareIcon color={'#' + label.color}/> ({'#' + label.color})
                                    </Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" gutterBottom>
                                        {label.description}
                                    </Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" gutterBottom>
                                        {label.issues.totalCount}
                                    </Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1" gutterBottom>
                                        {label.pullRequests !== undefined &&
                                            <React.Fragment>
                                                {label.pullRequests.totalCount}
                                            </React.Fragment>
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
}

ReposTable.propTypes = {
    classes: PropTypes.object.isRequired,
    labels: PropTypes.array.isRequired,
};

export default withStyles(styles)(ReposTable);
