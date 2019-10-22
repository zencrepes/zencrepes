import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import Summary from './Summary/index.js';
import BinsCreatedSince from './BinsCreatedSince/index.js';
import BinsLastUpdated from './BinsLastUpdated/index.js';
import BinsLastPushed from './BinsLastPushed/index.js';
import IssuesPresent from './IssuesPresent/index.js';
import PullRequestsPresent from './PullRequestsPresent/index.js';
import MilestonesPresent from './MilestonesPresent/index.js';
import ProtectedBranchesPresent from './ProtectedBranchesPresent/index.js';
import ReleasesPresent from './ReleasesPresent/index.js';
import ProjectsPresent from './ProjectsPresent/index.js';
import TeamsPresent from './TeamsPresent/index.js';
import IsFork from './IsFork/index.js';
import HasCodeOfConduct from './HasCodeOfConduct/index.js';
import HasDescription from './HasDescription/index.js';
import HasIssuesEnabled from './HasIssuesEnabled/index.js';
import HasWikiEnabled from './HasWikiEnabled/index.js';
import IsPrivate from './IsPrivate/index.js';
import BinsForkCount from './BinsForkCount/index.js';
import BinsStargazersCount from './BinsStargazersCount/index.js';
import BinsVulnerabilityAlertsCount from './BinsVulnerabilityAlertsCount/index.js';
import BinsWatchersCount from './BinsWatchersCount/index.js';

class Stats extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <Grid item xs={6} sm={3} md={4}>
            <Summary />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <IsPrivate />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <HasDescription />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <HasIssuesEnabled />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <HasWikiEnabled />
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <Grid item xs={6} sm={4} md={4}>
            <BinsCreatedSince />
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            <BinsLastUpdated />
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            <BinsLastPushed />
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <Grid item xs={6} sm={4} md={3}>
            <BinsForkCount />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <BinsStargazersCount />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <BinsVulnerabilityAlertsCount />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <BinsWatchersCount />
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <Grid item xs={6} sm={4} md={2}>
            <IsFork />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <ProtectedBranchesPresent />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ProjectsPresent />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <TeamsPresent />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <HasCodeOfConduct />
          </Grid>
        </Grid>
        <Grid
          container
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
          spacing={8}
        >
          <Grid item xs={6} sm={4} md={2}>
            <PullRequestsPresent />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <MilestonesPresent />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <ReleasesPresent />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <IssuesPresent />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Stats;
