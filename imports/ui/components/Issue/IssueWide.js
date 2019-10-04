import React, { Component } from 'react';
import XRegExp from 'xregexp';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid/Grid';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
//import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import { Calendar } from 'mdi-material-ui';
//import CalendarTodayIcon from '@material-ui/icons/Calendar';

import Moment from 'react-moment';

import { StateLabel, Label } from '@primer/components';
import fontColorContrast from 'font-color-contrast';
import PrIcon from './PrIcon.js';

import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import { withRouter } from 'react-router-dom';

//https://forums.meteor.com/t/meteor-scss-react/41654/8
//https://styleguide.github.com/primer/components/avatars/
//import "primer-avatars";

const styles = theme => ({
  repoName: {
    color: '#586069!important',
    fontSize: '16px',
    marginRight: '5px',
    textDecoration: 'none'
  },
  issueTitle: {
    fontSize: '16px',
    color: '#000000!important',
    textDecoration: 'none'
  },
  authorLink: {
    textDecoration: 'none',
    fontSize: '12px',
    color: '#586069!important'
  },
  issueSubTitle: {
    textDecoration: 'none',
    fontSize: '12px',
    color: '#586069!important'
  },
  avatar: {
    width: 35,
    height: 35
  },
  points: {
    width: 35,
    height: 35
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
    fontSize: 14,
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
  },
  link: {
    textDecoration: 'none'
  }
});

class Issue extends Component {
  constructor(props) {
    super(props);
  }

  linkGraph = () => {
    const { issue } = this.props;
    const query = { id: { $in: [issue.id] } };
    this.props.history.push({
      pathname: '/issues/graph',
      search: '?q=' + encodeURIComponent(JSON.stringify(query)),
      state: { detail: query }
    });
  };

  render() {
    const { classes, issue } = this.props;
    //    const pointsExp = RegExp('SP:[.\\d]');
    //    const boardExp = RegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
    const pointsExp = XRegExp('SP:[.\\d]');
    const boardExp = XRegExp('(?<type>AB):(?<priority>[.\\d]):(?<name>.+)');
    return (
      <React.Fragment>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <Grid item>
            <Grid
              container
              direction='column'
              justify='space-evenly'
              alignItems='flex-start'
              spacing={0}
            >
              <Grid item>
                <Tooltip title={issue.state}>
                  <a
                    href={issue.url}
                    className={classes.link}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    {issue.state === 'OPEN' ? (
                      <StateLabel status='issueOpened'>Open</StateLabel>
                    ) : (
                      <StateLabel status='issueClosed'>Closed</StateLabel>
                    )}
                  </a>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title='Explore the graph'>
                  <BubbleChartIcon color='disabled' onClick={this.linkGraph} />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid
              container
              direction='column'
              justify='flex-start'
              alignItems='flex-start'
              spacing={0}
            >
              <Grid item>
                <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-start'
                  spacing={8}
                >
                  <Grid item>
                    <a
                      href={issue.repo.url}
                      className={classes.repoName}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {issue.org.login}/{issue.repo.name}
                    </a>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <a
                      href={issue.url}
                      className={classes.issueTitle}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {issue.title}
                    </a>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                {issue.labels.totalCount > 0 && (
                  <Grid
                    container
                    direction='row'
                    justify='flex-end'
                    alignItems='flex-end'
                    spacing={0}
                  >
                    {//Filters out labels which are point since points are listed in the last column anyway
                    issue.labels.edges
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
                              style={{
                                background: '#' + label.node.color,
                                color: fontColorContrast('#' + label.node.color)
                              }}
                            >
                              {label.node.name}
                            </Label>
                          </Grid>
                        );
                      })}
                  </Grid>
                )}
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-start'
                  spacing={8}
                >
                  {issue.milestone !== null && (
                    <Grid item>
                      <Tooltip title='Issue attached to milestone'>
                        <Chip
                          icon={<Calendar className={classes.iconSprint} />}
                          label={issue.milestone.title}
                          className={classes.chipAgile}
                          color='primary'
                          variant='outlined'
                          target='_blank'
                          component='a'
                          href={issue.milestone.url}
                          clickable
                        />
                      </Tooltip>
                    </Grid>
                  )}
                  {issue.boardState !== undefined && issue.boardState !== null && (
                    <Grid item>
                      <Tooltip title='Current Agile State of the issue'>
                        <Chip
                          icon={
                            <ViewColumnIcon className={classes.iconSprint} />
                          }
                          label={issue.boardState.name}
                          className={classes.chipAgile}
                          color='primary'
                          variant='outlined'
                        />
                      </Tooltip>
                    </Grid>
                  )}
                  {issue.projectCards.edges.map(card => (
                    <Grid item key={card.node.id}>
                      <Tooltip
                        title={'GitHub Project: ' + card.node.project.name}
                      >
                        <Chip
                          icon={
                            <ViewColumnIcon className={classes.iconSprint} />
                          }
                          label={
                            card.node.column !== null
                              ? card.node.column.name
                              : 'NO COLUMN SET'
                          }
                          className={classes.chipAgile}
                          color='primary'
                          variant='outlined'
                          target='_blank'
                          component='a'
                          href={
                            card.node.project.url !== undefined
                              ? card.node.project.url
                              : '#'
                          }
                          clickable
                        />
                      </Tooltip>
                    </Grid>
                  ))}
                  {issue.pullRequests.edges.map(node => (
                    <Grid item key={node.node.id}>
                      <PrIcon pr={node.node} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item className={classes.issueSubTitle}>
                <span>
                  <a
                    href={issue.url}
                    className={classes.issueSubTitle}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    #{issue.number}
                  </a>{' '}
                </span>
                <span>
                  opened on{' '}
                  <Moment format='ddd MMM D, YYYY'>{issue.createdAt}</Moment>
                </span>
                {issue.author !== null && (
                  <span>
                    {' '}
                    by{' '}
                    <a href={issue.author.url} className={classes.authorLink}>
                      #{issue.author.login}
                    </a>
                  </span>
                )}
                {issue.closedAt !== null ? (
                  <span>
                    , closed on{' '}
                    <Moment format='ddd MMM D, YYYY'>{issue.closedAt}</Moment>
                  </span>
                ) : (
                  <span>
                    , last updated on{' '}
                    <Moment format='ddd MMM D, YYYY'>{issue.updatedAt}</Moment>
                  </span>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction='column'
              justify='flex-end'
              alignItems='flex-end'
              spacing={0}
            >
              <Grid item>
                {issue.assignees.totalCount > 0 && (
                  <Grid
                    container
                    direction='row'
                    justify='flex-end'
                    alignItems='flex-start'
                    spacing={8}
                  >
                    {issue.assignees.edges.map(assignee => {
                      return (
                        <Grid item key={assignee.node.login}>
                          <Tooltip
                            title={
                              assignee.node.name === null ||
                              assignee.node.name === ''
                                ? assignee.node.login
                                : assignee.node.name
                            }
                          >
                            <Avatar
                              alt={assignee.node.login}
                              src={assignee.node.avatarUrl}
                              className={classes.avatar}
                            />
                          </Tooltip>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Grid>
              <Grid item>
                <Avatar className={classes.points}>{issue.points}</Avatar>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Issue.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  issue: PropTypes.object
};

export default withRouter(withStyles(styles)(Issue));
// <span><DirectionsRunIcon className={classes.iconSprint} />{issue.milestone.title}</span>
// <span><ViewColumnIcon className={classes.iconSprint} />{issue.boardState.name}</span>
