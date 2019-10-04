import React, { Component } from 'react';
import XRegExp from 'xregexp';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import { Label, CounterLabel, Avatar } from '@primer/components';

import Moment from 'react-moment';

const styles = theme => ({
  root: {
    minWidth: '220px',
    width: '100%',
    padding: '5px'
  },
  repoName: {
    color: '#586069!important',
    fontSize: '14px',
    marginRight: '5px',
    textDecoration: 'none'
  },
  pullrequestTitle: {
    fontSize: '14px',
    color: '#000000!important',
    textDecoration: 'none'
  },
  authorLink: {
    textDecoration: 'none',
    fontSize: '12px',
    color: '#586069!important'
  },
  pullrequestSubTitle: {
    textDecoration: 'none',
    fontSize: '10px',
    color: '#586069!important'
  },
  avatar: {
    width: 20,
    height: 20
  },
  chip: {
    marginRight: '5px',
    height: 25
  },
  iconOpen: {
    margin: theme.spacing.unit,
    fontSize: 20,
    color: red[800]
  },
  iconClosed: {
    margin: theme.spacing.unit,
    fontSize: 20,
    color: green[800]
  },
  iconSprint: {
    fontSize: 16,
    margin: 0
  },
  label: {
    marginRight: 5,
    marginTop: 10,
    padding: 5,
    border: '1px solid #eeeeee'
  },
  chipAgile: {
    margin: '4px',
    height: '15px'
  }
});

class PullrequestCompact extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, pullrequest } = this.props;
    //    const pointsExp = RegExp('SP:[.\\d]');
    //    const boardExp = RegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
    const pointsExp = XRegExp('SP:[.\\d]');
    const boardExp = XRegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
    return (
      <Paper className={classes.root} elevation={1}>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <Grid item xs={12} sm container>
            <a
              href={pullrequest.repo.url}
              className={classes.repoName}
              target='_blank'
              rel='noopener noreferrer'
            >
              {pullrequest.org.login}/{pullrequest.repo.name}
            </a>
          </Grid>
          {pullrequest.assignees.totalCount > 0 && (
            <React.Fragment>
              {pullrequest.assignees.edges.map(assignee => {
                return (
                  <Grid item key={assignee.node.login}>
                    <Tooltip
                      title={
                        assignee.node.name === null || assignee.node.name === ''
                          ? assignee.node.login
                          : assignee.node.name
                      }
                    >
                      <Avatar mb={0} src={assignee.node.avatarUrl} size={20} />
                    </Tooltip>
                  </Grid>
                );
              })}
            </React.Fragment>
          )}
        </Grid>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <Grid item xs={12} sm container>
            <a
              href={pullrequest.url}
              className={classes.pullrequestTitle}
              target='_blank'
              rel='noopener noreferrer'
            >
              {pullrequest.title}
            </a>
          </Grid>
        </Grid>

        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={0}
        >
          {pullrequest.labels.totalCount > 0 && (
            <React.Fragment>
              {//Filters out labels which are point since points are listed in the last column anyway
              pullrequest.labels.edges
                .filter(
                  label =>
                    pointsExp.test(label.node.name) !== true &&
                    boardExp.test(label.node.description) !== true
                )
                .map(label => {
                  return (
                    <Grid item key={label.node.name}>
                      <Label
                        size='small'
                        m={1}
                        style={{ background: '#' + label.node.color }}
                      >
                        {label.node.name}
                      </Label>
                    </Grid>
                  );
                })}
            </React.Fragment>
          )}
        </Grid>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-end'
          spacing={8}
        >
          <Grid
            item
            xs={12}
            sm
            container
            className={classes.pullrequestSubTitle}
          >
            <span>
              <a
                href={pullrequest.url}
                className={classes.pullrequestSubTitle}
                target='_blank'
                rel='noopener noreferrer'
              >
                #{pullrequest.number}
              </a>
              &nbsp;
            </span>
            {pullrequest.closedAt !== null ? (
              <span>
                Closed on{' '}
                <Moment format='ddd MMM D, YYYY'>{pullrequest.closedAt}</Moment>
              </span>
            ) : (
              <span>
                Last updated on{' '}
                <Moment format='ddd MMM D, YYYY'>
                  {pullrequest.updatedAt}
                </Moment>
              </span>
            )}
          </Grid>
          <Grid item>
            <CounterLabel>{pullrequest.points}</CounterLabel>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

PullrequestCompact.propTypes = {
  classes: PropTypes.object.isRequired,
  pullrequest: PropTypes.object
};

export default withStyles(styles)(PullrequestCompact);

// <Chip className={classes.chip} style={{background: "#" + label.node.color}} label={label.node.name}/>
