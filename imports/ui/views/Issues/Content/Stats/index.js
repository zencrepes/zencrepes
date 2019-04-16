import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import Summary from './Summary/index.js';
import BinsOpenedDuring from './BinsOpenedDuring/index.js';
import BinsCreatedSince from './BinsCreatedSince/index.js';
import BinsLastUpdated from './BinsLastUpdated/index.js';
import ProjectsPopulated from './ProjectsPopulated/index.js';
import MilestonesPopulated from './MilestonesPopulated/index.js';
import AssigneesPopulated from './AssigneesPopulated/index.js';
import PointsPopulated from './PointsPopulated/index.js';
import MilestonesPastDue from './MilestonesPastDue/index.js';
import FacetsTree from './FacetsTree/index.js';

class Stats extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={6} sm={3} md={4}>
                        <Summary />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <ProjectsPopulated />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <MilestonesPopulated />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <AssigneesPopulated />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        <PointsPopulated />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={3} md={3}>
                        <MilestonesPastDue />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        <BinsOpenedDuring />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        <BinsCreatedSince />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        <BinsLastUpdated />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <FacetsTree
                            facetKey="labels"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <FacetsTree
                            facetKey="projectCards"
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <FacetsTree
                            facetKey="assignees"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <FacetsTree
                            facetKey="author.login"
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <FacetsTree
                            facetKey="milestone.title"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <FacetsTree
                            facetKey="repo.name"
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default Stats;
