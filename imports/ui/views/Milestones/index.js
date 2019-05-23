import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';

import General from '../../layouts/General/index.js';

import MilestonesFetch from '../../data/Milestones/Fetch/index.js';
import MilestonesEdit from '../../data/Milestones/Edit/index.js';

import MilestonesEditDialog from '../../components/Milestones/Edit/index.js';

import MilestonesFacets from './Facets/index.js';
import MilestonesQuery from './Query/index.js';
import Actions from './Actions/index.js';
import NoData from "./NoData/index.js";
import MilestonesTable from "./MilestonesTable/index.js";

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
        if (params.get('q') !== null) {
            const queryUrl = decodeURIComponent(params.get('q'));
            updateQuery(JSON.parse(queryUrl));
        } else {
            updateQuery({'state':{'$in':['OPEN']}});
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
        const { classes, milestones } = this.props;

        return (
            <General>
                <Actions />
                <MilestonesEdit loadModal={true} />
                <MilestonesFetch loadModal={false} />
                <MilestonesEditDialog />
                {milestones.length === 0 ? (
                    <NoData />
                ) : (
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
                                    <MilestonesTable
                                        milestones={milestones}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </General>
        );
    }
}

Milestones.propTypes = {
    classes: PropTypes.object.isRequired,
    milestones: PropTypes.array.isRequired,
    updateQuery: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    updateQuery: dispatch.milestonesView.updateQuery,
});

const mapState = state => ({
    milestones: state.milestonesView.milestones,
});


export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(Milestones)));
