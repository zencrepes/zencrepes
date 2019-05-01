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
import TitleField from "./TitleField.js";
import StateField from "./StateField.js";
import DueOnField from "./DueOnField.js";
import DescriptionField from "./DescriptionField.js";

import OrgLink from '../../../../../components/Links/OrgLink/index.js';
import RepoLink from '../../../../../components/Links/RepoLink/index.js';

import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import Typography from "@material-ui/core/Typography/Typography";

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
        const { classes, milestones, action, newTitle, newDueOn, newState, newDescription } = this.props;
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
                                Description
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Due On
                            </TableCell>
                            <TableCell component="th" scope="row">
                                State
                            </TableCell>
                            {action !== 'create' &&
                                <React.Fragment>
                                    <TableCell component="th" scope="row">
                                        Issues
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        PRs
                                    </TableCell>
                                </React.Fragment>
                            }
                            <TableCell component="th" scope="row">
                                GitHub Verified
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Remove
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {milestones.map(milestone => {
                            return (
                                <TableRow key={milestone.id}>
                                    <TableCell component="th" scope="row">
                                        {action}
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
                                        <TitleField
                                            action={action}
                                            title={milestone.title}
                                            url={milestone.url}
                                            newTitle={newTitle}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <DescriptionField
                                            action={action}
                                            description={milestone.description}
                                            newDescription={newDescription}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <DueOnField
                                            action={action}
                                            dueOn={milestone.dueOn}
                                            newDueOn={newDueOn}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <StateField
                                            action={action}
                                            state={milestone.state}
                                            newState={newState}
                                        />
                                    </TableCell>
                                    {action !== 'create' &&
                                        <React.Fragment>
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body1" gutterBottom>
                                                    {milestone.issues.totalCount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body1" gutterBottom>
                                                    {milestone.pullRequests.totalCount}
                                                </Typography>
                                            </TableCell>
                                        </React.Fragment>
                                    }
                                    <TableCell component="th" scope="row">
                                        <VerifState
                                            milestone={milestone}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <RemoveButton
                                            milestone={milestone}
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
    milestones: PropTypes.array.isRequired,
    action: PropTypes.string.isRequired,
    newTitle: PropTypes.string,
    newState: PropTypes.string,
    newDueOn: PropTypes.string,
    newDescription: PropTypes.string,
};

export default withStyles(styles)(StageTable);
