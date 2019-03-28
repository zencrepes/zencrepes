import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import VelocityWeeks from '../../../../components/Cards/VelocityWeeks/index.js';
import VelocityDays from '../../../../components/Cards/VelocityDays/index.js';

import BinsOpenedDuring from './BinsOpenedDuring/index.js';
import BinsCreatedSince from './BinsCreatedSince/index.js';

class Summary extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { defaultPoints, velocity, statsOpenedDuring, statsCreatedSince } = this.props;
        return (
            <React.Fragment>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={6} md={6}>
                        {velocity !== {} &&
                            <VelocityDays
                                velocity={velocity}
                                defaultPoints={defaultPoints}
                            />
                        }
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        {velocity !== {} &&
                            <VelocityWeeks
                                velocity={velocity}
                                defaultPoints={defaultPoints}
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
                    <Grid item xs={12} sm={6} md={6}>
                        {statsOpenedDuring.length > 0  &&
                            <BinsOpenedDuring
                                statsBins={statsOpenedDuring}
                            />
                        }
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        {statsCreatedSince.length > 0  &&
                            <BinsCreatedSince
                                statsBins={statsCreatedSince}
                            />
                        }
                    </Grid>

                </Grid>
            </React.Fragment>
        );
    }
}

Summary.propTypes = {
    remainingWorkRepos: PropTypes.array.isRequired,
    defaultPoints: PropTypes.bool.isRequired,
    remainingWorkPoints: PropTypes.number.isRequired,
    remainingWorkCount: PropTypes.number.isRequired,
    velocity: PropTypes.object.isRequired,

    statsOpenedDuring: PropTypes.array.isRequired,
    statsCreatedSince: PropTypes.array.isRequired,
};

const mapState = state => ({
    defaultPoints: state.pullrequestsView.defaultPoints,

    remainingWorkRepos: state.pullrequestsView.remainingWorkRepos,
    remainingWorkPoints: state.pullrequestsView.remainingWorkPoints,
    remainingWorkCount: state.pullrequestsView.remainingWorkCount,

    velocity: state.pullrequestsView.velocity,

    statsOpenedDuring: state.pullrequestsView.statsOpenedDuring,
    statsCreatedSince: state.pullrequestsView.statsCreatedSince,
});

export default connect(mapState, null)(Summary);
