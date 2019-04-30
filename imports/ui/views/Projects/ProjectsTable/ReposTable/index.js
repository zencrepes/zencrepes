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
import EditButton from './EditButton.js';

import RepoLink from '../../../../components/Links/RepoLink/index.js';
import OrgLink from '../../../../components/Links/OrgLink/index.js';
import ProjectLink from '../../../../components/Links/ProjectLink/index.js';

const styles = {
    blank: {
        width: '50'
    },
    table: {
        //width: '70%'
    },
    projectTitle: {
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
        const { classes, projects  } = this.props;
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
                                    Due On
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
                            {projects.map(project => {
                                let formattedDueOn = 'Not Set';
                                if (project.dueOn !== null) {
//                                    const dueOn = new Date(project.dueOn);
//                                    formattedDueOn = dueOn.getFullYear() + "-" + (dueOn.getMonth()+1 < 10 ? '0' : '') + (dueOn.getMonth()+1) + "-" + (dueOn.getDate() < 10 ? '0' : '') + (dueOn.getDate());
                                    formattedDueOn = project.dueOn.slice(0,10);
                                }
                                return (
                                    <TableRow key={project.id}>
                                        <TableCell component="th" scope="row" padding="none">
                                            <RemoveButton
                                                project={project}
                                            />
                                            <EditButton
                                                project={project}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <ProjectLink
                                                project={project}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <OrgLink
                                                org={project.org}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <RepoLink
                                                repo={project.repo}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <ProjectLink
                                                project={project}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body1" gutterBottom>
                                                {project.state}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body1" gutterBottom>
                                                {formattedDueOn}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="dense">
                                            <Typography variant="body1" gutterBottom>
                                                {project.issues.totalCount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="dense">
                                            <Typography variant="body1" gutterBottom>
                                                {project.pullRequests !== undefined &&
                                                    <React.Fragment>
                                                        {project.pullRequests.totalCount}
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
    projects: PropTypes.array.isRequired,
};

export default withStyles(styles)(ReposTable);
