import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import Actions from './Actions/index.js';

import NoData from './NoData/index.js';
import CurrentCompletion from "./CurrentCompletion/index.js";

class Project extends Component {
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
        const { issues, velocity, burndown, assignees, sprints, defaultPoints } = this.props;
        return (
            <General>
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
                                <CurrentCompletion
                                    issues={issues}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <span>Remaining Points</span>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <span>Days to completion</span>
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
                                <span>Summary</span>
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
                                <span>Burndown</span>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <span>Velocity</span>
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
                                <span>Issues</span>
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
                                <span>Assignees</span>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <span>Repositories</span>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <span>Labels</span>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
            </General>
        );
    }
}

Project.propTypes = {
    assignees: PropTypes.array.isRequired,
    issues: PropTypes.array.isRequired,
    sprints: PropTypes.array.isRequired,
    velocity: PropTypes.object.isRequired,
    burndown: PropTypes.object.isRequired,
    defaultPoints: PropTypes.bool.isRequired,

    initView: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
};

const mapState = state => ({
    assignees: state.projectView.assignees,
    issues: state.projectView.issues,
    velocity: state.projectView.velocity,
    burndown: state.projectView.burndown,
    sprints: state.projectView.sprints,
    defaultPoints: state.projectView.defaultPoints,
});

const mapDispatch = dispatch => ({
    initView: dispatch.projectView.initView,
    updateQuery: dispatch.projectView.updateQuery,
});

export default connect(mapState, mapDispatch)(withRouter(Project));

