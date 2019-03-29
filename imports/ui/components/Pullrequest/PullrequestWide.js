import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from "@material-ui/core/Grid/Grid";
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import Moment from 'react-moment';

import {
    StateLabel,
    Label,
} from '@primer/components';


const styles = theme => ({
    repoName: {
        color: '#586069!important',
        fontSize: '16px',
        marginRight: '5px',
        textDecoration: "none",
    },
    pullrequestTitle: {
        fontSize: '16px',
        color: '#000000!important',
        textDecoration: "none",
    },
    authorLink: {
        textDecoration: "none",
        fontSize: '12px',
        color: '#586069!important',
    },
    pullrequestSubTitle: {
        textDecoration: "none",
        fontSize: '12px',
        color: '#586069!important',
    },
    avatar: {
        width: 35,
        height: 35,
    },
    chip: {
        marginRight: '5px',
        height: 25,
    },
    iconOpen: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: red[800],
    },
    iconClosed: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: green[800],
    },
    iconSprint: {
        fontSize: 16,
        margin: 0
    },
    label: {
        marginRight: 5,
        marginTop: 10,
        padding: 5,
        border: "1px solid #eeeeee",
    },
    chipAgile: {
        margin: '4px',
        height: '15px',
    },
});


class Pullrequest extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, pullrequest } = this.props;
        const pointsExp = RegExp('SP:[.\\d]');
        const boardExp = RegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
        return (
            <React.Fragment>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item >
                        <Tooltip title={pullrequest.state}>
                            {pullrequest.state === 'OPEN' ?
                                <StateLabel status="pullOpened">Open</StateLabel>
                                :
                                <React.Fragment>
                                    {pullrequest.state === 'CLOSED' ?
                                        <StateLabel status="pullClosed">Closed</StateLabel>
                                        :
                                        <StateLabel status="pullMerged">Closed</StateLabel>
                                    }
                                </React.Fragment>
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
                            <Grid item >
                                <a href={pullrequest.repo.url} className={classes.repoName} target="_blank" rel="noopener noreferrer">{pullrequest.org.login}/{pullrequest.repo.name}</a>
                            </Grid>
                            <Grid item xs={12} sm container >
                                <a href={pullrequest.url} className={classes.pullrequestTitle} target="_blank" rel="noopener noreferrer">{pullrequest.title}</a>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item xs={12} sm container className={classes.sprintName}>
                                {pullrequest.milestone !== null &&
                                <Tooltip title="Pullrequest attached to sprint">
                                    <Chip
                                        icon={<DirectionsRunIcon className={classes.iconSprint} />}
                                        label={pullrequest.milestone.title}
                                        className={classes.chipAgile}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Tooltip>
                                }
                                {pullrequest.boardState !== undefined && pullrequest.boardState !== null &&
                                <Tooltip title="Current Agile State of the pullrequest">
                                    <Chip
                                        icon={<ViewColumnIcon className={classes.iconSprint} />}
                                        label={pullrequest.boardState.name}
                                        className={classes.chipAgile}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Tooltip>
                                }
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item className={classes.pullrequestSubTitle}>
                                <span><a href={pullrequest.url} className={classes.pullrequestSubTitle} target="_blank" rel="noopener noreferrer">#{pullrequest.number}</a> </span>
                                <span>opened on <Moment format="ddd MMM D, YYYY">{pullrequest.createdAt}</Moment></span>
                                {pullrequest.author !== null &&
                                <span> by <a href={pullrequest.author.url} className={classes.authorLink} >#{pullrequest.author.login}</a></span>
                                }
                                {pullrequest.closedAt !== null ? (
                                    <span>, closed on <Moment format="ddd MMM D, YYYY">{pullrequest.closedAt}</Moment></span>
                                ) : (
                                    <span>, last updated on <Moment format="ddd MMM D, YYYY">{pullrequest.updatedAt}</Moment></span>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item >
                        {pullrequest.labels.totalCount > 0 &&
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            {
                                //Filters out labels which are point since points are listed in the last column anyway
                                pullrequest.labels.edges.filter(label => pointsExp.test(label.node.name) !== true && boardExp.test(label.node.description) !== true).map((label) => {
                                    return (
                                        <Grid item key={label.node.name} >
                                            <Label size="large" m={1} style={{background: "#" + label.node.color}}>{label.node.name}</Label>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                        }
                    </Grid>
                    <Grid item >
                        {pullrequest.assignees.totalCount > 0 &&
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            {
                                pullrequest.assignees.edges.map((assignee) => {
                                    return (
                                        <Grid item key={assignee.node.login} >
                                            <Tooltip title={(assignee.node.name === null || assignee.node.name === '') ? assignee.node.login : assignee.node.name}>
                                                <Avatar alt={assignee.node.login} src={assignee.node.avatarUrl} className={classes.avatar} />
                                            </Tooltip>
                                        </Grid>
                                    )

                                })
                            }
                        </Grid>
                        }
                    </Grid>
                    <Grid item >
                        <Avatar className={classes.avatar}>{pullrequest.points}</Avatar>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

Pullrequest.propTypes = {
    classes: PropTypes.object.isRequired,
    pullrequest: PropTypes.object,
};

export default withStyles(styles)(Pullrequest);
// <span><DirectionsRunIcon className={classes.iconSprint} />{pullrequest.milestone.title}</span>
// <span><ViewColumnIcon className={classes.iconSprint} />{pullrequest.boardState.name}</span>
