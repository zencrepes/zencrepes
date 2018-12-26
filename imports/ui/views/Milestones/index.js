import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import MilestonesFetch from '../../data/Milestones/Fetch/index.js';
import MilestonesEdit from '../../data/Milestones/Edit/index.js';

import MilestonesList from './MilestonesList/index.js';

import MilestonesFacets from './Facets/index.js';
import MilestonesQuery from './Query/index.js';
import Actions from './Actions/index.js';

import OpenClosed from './Charts/OpenClosed/index.js';
import Mixed from './Charts/Mixed/index.js';
import Empty from './Charts/Empty/index.js';

const style = {
    root: {
        marginRight: '10px'
    },
    fullWidth :{
        width: '100%',
    }
};

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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
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
        const { classes } = this.props;

        return (
            <General>
                <Actions />
                <MilestonesEdit loadModal={true} />
                <MilestonesFetch loadModal={false} />
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
                                        <OpenClosed />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Mixed />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Empty />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm className={classes.fullWidth}>
                                <MilestonesList />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </General>
        );
    }
}

Milestones.propTypes = {
    classes: PropTypes.object,
    updateQuery: PropTypes.func.isRequired,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.milestonesView.updateQuery,
});

export default connect(null, mapDispatch)(withRouter(withStyles(style)(Milestones)));
