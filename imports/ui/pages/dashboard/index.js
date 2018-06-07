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
                    <Grid container>
                        <ItemGrid xs={12} sm={6} md={3}>
                            <StatsCard
                                icon={ContentCopy}
                                iconColor="orange"
                                title="Remaing Points"
                                description="49/50"
                                small="Pts"
                                statIcon={Warning}
                                statText="Using Query: QUERYNAME"
                            />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={3}>
                            <StatsCard
                                icon={Store}
                                iconColor="green"
                                title="Completed Yesterday"
                                description="5"
                                small="Pts"
                                statIcon={DateRange}
                                statText="Last 24 Hours"
                            />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={3}>
                            <StatsCard
                                icon={ContentCopy}
                                iconColor="red"
                                title="Completed this week"
                                description="32"
                                small="Pts"
                                statIcon={LocalOffer}
                                statText=""
                            />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={3}>
                            <StatsCard
                                icon={ContentCopy}
                                iconColor="blue"
                                title="Days to Completion"
                                description="8.3"
                                small="Days"
                                statIcon={Update}
                                statText="Working days"
                            />
                        </ItemGrid>
                    </Grid>
                    <GridList className={classes.gridList} cols={6}>
                        <GridListTile cols={2} rows={2}>
                            <EstimateCompletion />
                        </GridListTile>
                        <GridListTile cols={4} rows={2}>
                            <WorkRepartition />
                        </GridListTile>
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