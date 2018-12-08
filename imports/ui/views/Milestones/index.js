import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import styles from '../../styles.jsx';

import General from '../../layouts/General/index.js';

import MilestonesFetch from '../../data/Milestones/Fetch/index.js';
import MilestonesEdit from '../../data/Milestones/Edit/index.js';

import MilestonesTable from './MilestonesTable.js';
import LoadButton from './LoadButton.js';
import DeleteClosedEmptyButton from './DeleteClosedEmptyButton.js';

import MilestonesFacets from './Facets/index.js';
import MilestonesQuery from './Query/index.js';

class Milestones extends Component {
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
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { updateQuery } = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const queryUrl = params.get('q');

        const oldParams = new URLSearchParams(prevProps.location.search);
        const oldQueryUrl = oldParams.get('q');

        if (queryUrl !== oldQueryUrl) {
            updateQuery(JSON.parse(queryUrl));
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <General>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                        spacing={8}
                    >
                        <Grid item >
                            <MilestonesFacets />
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12} sm className={classes.fullWidth}>
                                    <MilestonesQuery />
                                </Grid>
                                <Grid item xs={12} sm className={classes.fullWidth}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                        spacing={8}
                                    >
                                        <Grid item xs={12} sm={12} md={4}>
                                            <h3>TODO: Chart to display a breakdown of open/closed milestones</h3>
                                            <LoadButton />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={4}>
                                            <h3>TODO: Chart & Button to show Milestones with a mixed closed/open</h3>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={4}>
                                            <h3>TODO: Chart & Button to show closed milestones with 0 issues</h3>
                                            <DeleteClosedEmptyButton />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm className={classes.fullWidth}>
                                    <MilestonesEdit loadModal={true} />
                                    <MilestonesFetch loadModal={false} />
                                    <MilestonesTable />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </General>
            </div>
        );
    }
}

Milestones.propTypes = {
    classes: PropTypes.object,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.milestonesView.updateQuery,
});

export default connect(null, mapDispatch)(withRouter(withStyles(styles)(Milestones)));
