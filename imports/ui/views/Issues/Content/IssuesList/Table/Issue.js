import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from "@material-ui/core/Grid/Grid";
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckIcon from '@material-ui/icons/Check';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';

import Moment from 'react-moment';

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
    repoName: {
        color: '#586069!important',
        fontSize: '16px',
        marginRight: '5px',
    },
    issueTitle: {
        fontSize: '16px',
        color: '#000000!important',
    },
    issueSubTitle: {
        fontSize: '12px',
        color: '#586069!important',
    },
    avatar: {
        width: 10,
        height: 10,
    },
    chip: {
        marginRight: '5px',
    },
    iconOpen: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: green[800],
    },
    iconClosed: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: red[800],
    },
    iconSprint: {
        margin: theme.spacing.unit,
        fontSize: 16,
        margin: 0
    },
    label: {
        marginRight: 5,
        marginTop: 10,
        padding: 5,
        border: "1px solid #eeeeee",
    }
});


class Issue extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, issue } = this.props;
        const pointsExp = RegExp('SP:[.\\d]');
        console.log(issue);
        return (
            <TableRow key={issue.id}>
                <TableCell component="th" scope="row">
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item >
                            <Tooltip title={issue.state}>
                                {issue.state === 'OPEN' ?
                                    <HourglassEmptyIcon className={classes.iconOpen} />
                                    :
                                    <CheckIcon className={classes.iconClosed} />
                                }
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={8}
                            >
                                <Grid item className={classes.repoName}>
                                    <a href="#">{issue.org.login}/{issue.repo.name}</a>
                                </Grid>
                                <Grid item xs={12} sm container className={classes.issueTitle}>
                                    {issue.title}
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={8}
                            >
                                <Grid item className={classes.issueSubTitle}>
                                    #{issue.number} opened on <Moment format="ddd MMM D, YYYY">{issue.createdAt}</Moment> by #{issue.author.login}
                                </Grid>
                                <Grid item xs={12} sm container className={classes.sprintName}>
                                    {issue.milestone !== null &&
                                        <Tooltip title="Issue attached to sprint">
                                            <span><DirectionsRunIcon className={classes.iconSprint} />{issue.milestone.title}</span>
                                        </Tooltip>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item >
                            {issue.labels.totalCount > 0 &&
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={8}
                                >
                                {
                                    //Filters out labels which are point since points are listed in the last column anyway
                                    issue.labels.edges.filter(label => pointsExp.test(label.node.name) !== true).map((label) => {
                                        return <Grid item key={label.node.name} ><Chip className={classes.chip} style={{background: "#" + label.node.color}} label={label.node.name}/></Grid>
                                    })
                                }
                                </Grid>
                            }
                        </Grid>
                        <Grid item >
                            {issue.assignees.totalCount > 0 &&
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={8}
                                >
                                {
                                    issue.assignees.edges.map((assignee) => {
                                        return <Grid item key={assignee.node.login} ><Avatar alt={assignee.node.login} src={assignee.node.avatarUrl} className={classes.avatar} /></Grid>
                                    })
                                }
                                </Grid>
                            }
                        </Grid>
                        <Grid item >
                            <Avatar className={classes.avatar}>{issue.points}</Avatar>
                        </Grid>
                    </Grid>
                </TableCell>
            </TableRow>
        );
    }
}

Issue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Issue);
