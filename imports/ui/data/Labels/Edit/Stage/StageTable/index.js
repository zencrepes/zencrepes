import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import RemoveButton from './RemoveButton.js';
import VerifState from './VerifState.js';

import NameField from './NameField.js';
import ColorField from './ColorField.js';
import DescriptionField from './DescriptionField.js';

import OrgLink from '../../../../../components/Links/OrgLink/index.js';
import RepoLink from '../../../../../components/Links/RepoLink/index.js';

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
        const { classes, labels, action, newName, newDescription, newColor  } = this.props;
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
                        {labels.map(label => {
                            return (
                                <TableRow key={label.id}>
                                    <TableCell component="th" scope="row">
                                        {action}
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
                                        <NameField
                                            action={action}
                                            name={label.name}
                                            url={label.url}
                                            newName={newName}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <ColorField
                                            action={action}
                                            color={label.color}
                                            newColor={newColor}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <DescriptionField
                                            action={action}
                                            description={label.description}
                                            newDescription={newDescription}
                                        />
                                    </TableCell>
                                    {action !== 'create' &&
                                        <React.Fragment>
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body1" gutterBottom>
                                                    {label.issues.totalCount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body1" gutterBottom>
                                                    {label.pullRequests.totalCount}
                                                </Typography>
                                            </TableCell>
                                        </React.Fragment>
                                    }
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

    newName: PropTypes.string.isRequired,
    newDescription: PropTypes.string,
    newColor: PropTypes.string.isRequired,
};

export default withStyles(styles)(StageTable);
