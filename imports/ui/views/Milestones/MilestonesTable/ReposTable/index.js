import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import RemoveButton from './RemoveButton.js';

import RepoLink from '../../../../components/Common/RepoLink/index.js';
import OrgLink from '../../../../components/Common/OrgLink/index.js';
import MilestoneLink from '../../../../components/Common/MilestoneLink/index.js';

const styles = {
    blank: {
        width: '50'
    },
    table: {
        //width: '70%'
    },
    milestoneTitle: {
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
        const { classes, milestones  } = this.props;
        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={8}
            >
                <Grid item xs={12} sm container className={classes.blank}>

                </Grid>
                <Grid item >
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell component="th" scope="row" padding="none">
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
                                    Title
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    State
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    DueOn
                                </TableCell>
                                <TableCell component="th" scope="row" padding="dense">
                                    Issues
                                </TableCell>
                                <TableCell component="th" scope="row" padding="dense">
                                    PRs
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {milestones.map(milestone => {
                                return (
                                    <TableRow key={milestone.id}>
                                        <TableCell component="th" scope="row" padding="none">
                                            <RemoveButton
                                                milestone={milestone}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <MilestoneLink
                                                milestone={milestone}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <OrgLink
                                                org={milestone.org}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <RepoLink
                                                repo={milestone.repo}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <MilestoneLink
                                                milestone={milestone}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body1" gutterBottom>
                                                {milestone.state}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body1" gutterBottom>
                                                {milestone.dueOn}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="dense">
                                            <Typography variant="body1" gutterBottom>
                                                {milestone.issues.totalCount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="dense">
                                            <Typography variant="body1" gutterBottom>
                                                {milestone.pullRequests !== undefined &&
                                                    <React.Fragment>
                                                        {milestone.pullRequests.totalCount}
                                                    </React.Fragment>
                                                }
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12} sm container className={classes.blank}>

                </Grid>
            </Grid>
        );
    }
}

ReposTable.propTypes = {
    classes: PropTypes.object.isRequired,
    milestones: PropTypes.array.isRequired,
};

export default withStyles(styles)(ReposTable);
