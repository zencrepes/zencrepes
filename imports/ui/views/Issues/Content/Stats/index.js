import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

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

class Stats extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const {
            statsOpenedDuring,
            statsCreatedSince,
            statsUpdatedSince,
            statsProjectsCount,
            statsMilestonesCount,
            statsPointsCount,
            statsAssigneesCount,
        } = this.props;
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
                        {statsProjectsCount.length > 0  &&
                        <ProjectsPopulated
                            stats={statsProjectsCount}
                        />
                        }
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        {statsMilestonesCount.length > 0  &&
                        <MilestonesPopulated
                            stats={statsMilestonesCount}
                        />
                        }
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        {statsAssigneesCount.length > 0  &&
                        <AssigneesPopulated
                            stats={statsAssigneesCount}
                        />
                        }
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        {statsPointsCount.length > 0  &&
                        <PointsPopulated
                            stats={statsPointsCount}
                        />
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
                    <Grid item xs={12} sm={3} md={3}>
                        <MilestonesPastDue />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        {statsOpenedDuring.length > 0  &&
                        <BinsOpenedDuring
                            statsBins={statsOpenedDuring}
                        />
                        }
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        {statsCreatedSince.length > 0  &&
                        <BinsCreatedSince
                            statsBins={statsCreatedSince}
                        />
                        }
                    </Grid>
                    <Grid item xs={12} sm={3} md={3}>
                        {statsUpdatedSince.length > 0  &&
                        <BinsLastUpdated
                            statsBins={statsUpdatedSince}
                        />
                        }
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

Stats.propTypes = {
    statsOpenedDuring: PropTypes.array.isRequired,
    statsCreatedSince: PropTypes.array.isRequired,
    statsUpdatedSince: PropTypes.array.isRequired,
    statsProjectsCount: PropTypes.array.isRequired,
    statsMilestonesCount: PropTypes.array.isRequired,
    statsPointsCount: PropTypes.array.isRequired,
    statsAssigneesCount: PropTypes.array.isRequired,
};

const mapState = state => ({
    statsOpenedDuring: state.issuesView.statsOpenedDuring,
    statsCreatedSince: state.issuesView.statsCreatedSince,
    statsUpdatedSince: state.issuesView.statsUpdatedSince,
    statsProjectsCount: state.issuesView.statsProjectsCount,
    statsMilestonesCount: state.issuesView.statsMilestonesCount,
    statsPointsCount: state.issuesView.statsPointsCount,
    statsAssigneesCount: state.issuesView.statsAssigneesCount,
});

export default connect(mapState, null)(Stats);
