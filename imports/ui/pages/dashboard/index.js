import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";

import AppMenu from '../../components/AppMenu/index.js';
import EstimateCompletion from '../../components/Cards/EstimateCompletion/index.js';
import WeeklyVelocity from '../../components/Cards/WeeklyVelocity/index.js';
import WorkRepartition from '../../components/Cards/WorkRepartition/index.js';
import OpenIssuesClosedSprint from '../../components/Cards/OpenIssuesClosedSprint/index.js';

import ItemGrid from '../../components/Grid/ItemGrid.js';

import StatsCard from '../../components/Cards/StatsCard/index.js';
import VelocityWeeks from '../../components/Cards/VelocityWeeks/index.js';
import VelocityDays from '../../components/Cards/VelocityDays/index.js';
import RepartitionByAssignee from '../../components/Cards/RepartitionByAssignee/index.js';
import TimeToCompletionAssignee from '../../components/Cards/TimeToCompletionAssignee/index.js';
import MyIssues from '../../components/Cards/MyIssues/index.js';
import OldestIssues from '../../components/Cards/OldestIssues/index.js';
import DaysToCompletion from '../../components/Cards/DaysToCompletion/index.js';

import QueryPicker from './QueryPicker.js';

import {
    ContentCopy,
    Store,
    InfoOutline,
    Warning,
    DateRange,
    LocalOffer,
    Update,
    ArrowUpward,
    AccessTime,
    Accessibility
} from "@material-ui/icons";

import Toolbar from '@material-ui/core/Grid';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import Issues, { cfgIssues } from '../../data/Issues.js';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        paddingTop: 80,
        minWidth: 0, // So the Typography noWrap works
    },
    gridList: {
        width: '100%',
        //height: 450,
    },
    subheader: {
        width: '100%',
    },
    container: {
        paddingRight: "15px",
        paddingLeft: "15px",
        marginRight: "auto",
        marginLeft: "auto"
    }
});

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppMenu />
                <main className={classes.content}>
                    <Toolbar className={classes.container}>
                        <QueryPicker />
                    </Toolbar>
                    <Grid container>
                        <ItemGrid xs={12} sm={6} md={3}>
                            <StatsCard
                                icon={ContentCopy}
                                iconColor="orange"
                                title="Remaing Points"
                                description="49/50"
                                small="Pts"
                                statIcon={Warning}
                                statText="Add small barchart showing points repartition per repo"
                            />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={3}>
                            <VelocityDays
                                icon={Store}
                                iconColor="green"
                                title="Completed Yesterday"
                                description="5"
                                small="Pts"
                                statIcon={DateRange}
                                statText="Add small chart showing velocity on past 20 days"
                            />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={3}>
                            <VelocityWeeks
                                icon={ContentCopy}
                                iconColor="red"
                                title="Completed this week"
                                description="32"
                                small="Pts"
                                statIcon={LocalOffer}
                                statText="Add small chart showing velocity past 16 weeks"
                            />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={3}>
                            <DaysToCompletion
                                icon={ContentCopy}
                                iconColor="blue"
                                title="Days to Completion (4w)"
                                description="8.3b"
                                small="Days"
                                statIcon={Update}
                                statText="Display Days to completion using multiple periods"
                            />
                        </ItemGrid>
                    </Grid>
                    <Grid container>
                        <ItemGrid xs={12} sm={12} md={6}>
                            <TimeToCompletionAssignee headerColor="green" />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={12} md={6}>
                            <RepartitionByAssignee headerColor="orange" />
                        </ItemGrid>
                    </Grid>
                    <Grid container>
                        <ItemGrid xs={12} sm={12} md={6}>
                            <MyIssues headerColor="orange" />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={12} md={6}>
                            <OldestIssues headerColor="green" />
                        </ItemGrid>
                    </Grid>
                    <GridList className={classes.gridList} cols={6}>
                        <GridListTile cols={2} rows={2}>
                            <OpenIssuesClosedSprint />
                        </GridListTile>
                        <GridListTile cols={3} rows={2}>
                            <WeeklyVelocity />
                        </GridListTile>
                    </GridList>
                </main>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(Dashboard)));