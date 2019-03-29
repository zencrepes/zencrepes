import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import TemplateUsage from './TemplateUsage/index.js';

class Summary extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { defaultPoints, templateUsage } = this.props;
        return (
            <React.Fragment>
                <Grid item xs={12} sm={12} md={12}>
                    <TemplateUsage
                        templateUsage={templateUsage}
                        defaultPoints={defaultPoints}
                    />
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
    templateUsage: PropTypes.object.isRequired,
};

const mapState = state => ({
    defaultPoints: state.pullrequestsView.defaultPoints,

    remainingWorkRepos: state.pullrequestsView.remainingWorkRepos,
    remainingWorkPoints: state.pullrequestsView.remainingWorkPoints,
    remainingWorkCount: state.pullrequestsView.remainingWorkCount,

    velocity: state.pullrequestsView.velocity,

    statsOpenedDuring: state.pullrequestsView.statsOpenedDuring,
    statsCreatedSince: state.pullrequestsView.statsCreatedSince,

    templateUsage: state.pullrequestsView.templateUsage
});

export default connect(mapState, null)(Summary);
