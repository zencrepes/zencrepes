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
        width: '10px',
        height: '10px',
    },
    chip: {
        marginRight: '5px',
    }
});


class Issue extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, issue } = this.props;
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
                            {issue.state}
                        </Grid>
                        <Grid item xs={12} sm container>
                            <span className={classes.repoName}>{issue.org.login}/{issue.repo.name}</span>
                            <span className={classes.issueTitle}>{issue.title}</span>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item xs={12} sm container>
                            <span className={classes.issueSubTitle}>
                                #{issue.number} opened on <Moment format="ddd MMM D, YYYY">{issue.createdAt}</Moment> by #{issue.author.login}
                            </span>
                            {issue.milestone !== null &&
                                <span className={classes.sprintName}>
                                    Sprint: {issue.milestone.title}
                                </span>
                            }
                        </Grid>
                    </Grid>
                </TableCell>
                {issue.labels.totalCount > 0 &&
                    <TableCell component="th" scope="row">
                        {
                            issue.labels.edges.map((label) => {
                                return <Chip label={label.node.name} className={classes.chip} key={label.node.name} />
                            })
                        }
                    </TableCell>
                }
                {issue.assignees.totalCount > 0 &&
                    <TableCell component="th" scope="row">
                        {
                            issue.assignees.edges.map((assignee) => {
                                return <Avatar alt={assignee.node.login} src={assignee.node.avatarUrl} className={classes.avatar} key={assignee.node.login}/>
                            })
                        }
                    </TableCell>
                }
                <TableCell component="th" scope="row">
                    {issue.points}
                </TableCell>
            </TableRow>
        );
    }
}

Issue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Issue);
