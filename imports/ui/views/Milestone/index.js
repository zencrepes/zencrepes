import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';
import IssuesFetch from '../../data/Issues/Fetch/index.js';
import IssuesEdit from '../../data/Issues/Edit/index.js';

import Actions from './Actions/index.js';

import CurrentCompletion from "./CurrentCompletion/index.js";
import RemainingPoints from "./RemainingPoints/index.js";
import DaysToCompletion from "./DaysToCompletion/index.js";
import Burndown from "./Burndown/index.js";
import VelocityWeeks from "./VelocityWeeks/index.js";
import Issues from "./Issues/index.js";

import Summary from "./Summary/index.js";
import Controls from "./Controls/index.js";

import Assignees from "./Assignees/index.js";
import Milestones from "./Repositories/index.js";
import Labels from "./Labels/index.js";

import MilestonesEdit from '../../data/Milestones/Edit/index.js';
import MilestonesEditDialog from '../../components/Milestones/Edit/index.js';

class Milestone extends Component {
    constructor(props) {
        super(props);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    componentDidMount() {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        if (params.get('q') !== null) {
            const queryUrl = decodeURIComponent(params.get('q'));
            updateQuery(JSON.parse(queryUrl));
        } else {
            updateQuery({});
        }
    }

    componentDidUpdate(prevProps) {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = decodeURIComponent(params.get('q'));

        const oldParams = new URLSearchParams(prevProps.location.search);
        const oldQueryUrl = decodeURIComponent(oldParams.get('q'));

        if (queryUrl !== oldQueryUrl) {
            updateQuery(JSON.parse(queryUrl));
        }
    }

    render() {
        return (
            <General>
                <Actions />
                <IssuesFetch />
                <IssuesEdit />
                <MilestonesEdit />
                <MilestonesEditDialog />
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm={6} md={8}>
                        <Summary />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Controls />
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
                        <CurrentCompletion />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <RemainingPoints />
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
                        <Milestones />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Labels />
                    </Grid>
                </Grid>
            </General>
        );
    }
}

Milestone.propTypes = {
    location: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.milestoneView.updateQuery,
});

export default connect(null, mapDispatch)(withRouter(Milestone));

