import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import RemoveButton from './RemoveButton.js';
import VerifState from './VerifState.js';

import OrgLink from '../../../../../components/Links/OrgLink/index.js';
import RepoLink from '../../../../../components/Links/RepoLink/index.js';

import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

import {
    Label,
} from '@primer/components';
import fontColorContrast from "font-color-contrast";
import Grid from "@material-ui/core/Grid/Grid";

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

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
    avatar: {
        width: 35,
        height: 35,
    },
});

class StageTable extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, issues } = this.props;
        return (
            <div className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
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
                                Body
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Labels
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Assignees
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Milestone
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Verified
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Remove
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issues.map(issue => {
                            let issueBody = '';
                            if (issue.create.body !== undefined) {
                                issueBody = issue.create.body
                                if (issueBody.length > 20) {
                                    issueBody = issueBody.slice(0, 25) + '...';
                                }
                            }
                            return (
                                <TableRow key={issue.id}>
                                    <TableCell component="th" scope="row">
                                        {issue.create.repo !== undefined &&
                                            <OrgLink
                                                org={issue.create.repo.org}
                                            />
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {issue.create.repo !== undefined &&
                                            <RepoLink
                                                repo={issue.create.repo}
                                            />
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {issue.create.title !== undefined &&
                                            <span>{issue.create.title}</span>
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {issue.create.body !== undefined &&
                                            <span>{issueBody}</span>
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {issue.create.labels !== undefined &&
                                        <Grid
                                            container
                                            direction="row"
                                            justify="flex-end"
                                            alignItems="flex-end"
                                            spacing={0}
                                        >
                                            {issue.create.labels.map(label => (
                                                <Grid item key={label.name} >
                                                    <Label size="small" m={1} style={{background: "#" + label.color, color: fontColorContrast("#" + label.color)}}>{label.name}</Label>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {issue.create.assignees !== undefined &&
                                            <Grid
                                                container
                                                direction="row"
                                                justify="flex-end"
                                                alignItems="flex-start"
                                                spacing={8}
                                            >
                                                {
                                                    issue.create.assignees.map((assignee) => {
                                                        return (
                                                            <Grid item key={assignee.login} >
                                                                <Tooltip title={(assignee.name === null || assignee.name === '') ? assignee.login : assignee.name}>
                                                                    <Avatar alt={assignee.login} src={assignee.avatarUrl} className={classes.avatar} />
                                                                </Tooltip>
                                                            </Grid>
                                                        )

                                                    })
                                                }
                                            </Grid>
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {issue.create.milestone !== undefined &&
                                            <span>{issue.create.milestone.title}</span>
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <VerifState
                                            issue={issue}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <RemoveButton
                                            issue={issue}
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
    issues: PropTypes.array.isRequired,
    action: PropTypes.string.isRequired,
};

export default withStyles(styles)(StageTable);
