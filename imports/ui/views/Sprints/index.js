import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import DaysToCompletion from './DaysToCompletion/index.js';

import Assignees from './Assignees/index.js';
import Repositories from './Repositories/index.js';
import Labels from './Labels/index.js';
import Issues from './Issues/index.js';
import Actions from './Actions/index.js';
import Summary from './Summary/index.js';
import RemainingPoints from './RemainingPoints/index.js';

import CurrentCompletion from './CurrentCompletion/index.js';
import Burndown from './Burndown/index.js';
import VelocityWeeks from './VelocityWeeks/index.js';

import NoData from './NoData/index.js';

import IssuesFetch from '../../data/Issues/Fetch/index.js';
import IssuesEdit from '../../data/Issues/Edit/index.js';

import MilestonesEdit from '../../data/Milestones/Edit/index.js';
import MilestonesFetch from '../../data/Milestones/Fetch/index.js';
import MilestonesEditDialog from '../../components/Milestones/Edit/index.js';

class Sprints extends Component {
    constructor(props) {
        super(props);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    componentDidMount() {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = params.get('q');
        if (queryUrl === null) {
            updateQuery({});
        } else {
            updateQuery(JSON.parse(queryUrl));
        }
    }

    componentDidUpdate(prevProps) {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = params.get('q');

        const oldParams = new URLSearchParams(prevProps.location.search);
        const oldQueryUrl = oldParams.get('q');

        if (queryUrl !== oldQueryUrl) {
            updateQuery(JSON.parse(queryUrl));
        }
    }

    render() {
        const { sprints } = this.props;
        return (
            <General>
                <IssuesFetch />
                <IssuesEdit />
                <MilestonesFetch />
                <MilestonesEdit />
                <MilestonesEditDialog />
                {(sprints.length === 0) ? (
                    <NoData />
                ) : (
                    <React.Fragment>
                        <Actions />
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item xs={12} sm={6} md={4}>
                                <CurrentCompletion />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <RemainingPoints  />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <DaysToCompletion />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item xs={12} sm={12} md={12}>
                                <Summary />
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
                                <Burndown />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <VelocityWeeks />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item xs={12} sm={12} md={12}>
                                <Issues />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={8}
                        >
                            <Grid item xs={12} sm={6} md={4}>
                                <Assignees />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Repositories />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Labels />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
            </General>
        );
    }
}

Sprints.propTypes = {
    sprints: PropTypes.array.isRequired,

    initView: PropTypes.func.isRequired,
    updateQuery: PropTypes.func.isRequired,

    location: PropTypes.object.isRequired,
};

const mapState = state => ({
    sprints: state.sprintsView.sprints,
});

const mapDispatch = dispatch => ({
    initView: dispatch.sprintsView.initView,
    updateQuery: dispatch.sprintsView.updateQuery,
});

export default connect(mapState, mapDispatch)(withRouter(Sprints));

