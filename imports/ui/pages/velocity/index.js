import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";

import AppMenu from '../../components/AppMenu/index.js';

import ItemGrid from '../../components/Grid/ItemGrid.js';

import StatsCard from '../../components/Cards/StatsCard/index.js';
import RemainingPoints from '../../components/Cards/RemainingPoints/index.js';
import OverallVelocityWeeks from '../../components/Cards/OverallVelocityWeeks/index.js';
import OverallMemberVelocityWeeks from '../../components/Cards/OverallMemberVelocityWeeks/index.js';
import RepartitionByAssignee from '../../components/Cards/RepartitionByAssignee/index.js';
import TimeToCompletionAssignee from '../../components/Cards/TimeToCompletionAssignee/index.js';
import MyIssues from '../../components/Cards/MyIssues/index.js';
import OldestIssues from '../../components/Cards/OldestIssues/index.js';
import DaysToCompletion from '../../components/Cards/DaysToCompletion/index.js';


import QuerySelect from '../../components/Query/Select/index.js';
import DataLoader from './DataLoader.js';

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

import { Broom, CodeBraces, Ticket } from 'mdi-material-ui';


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

class Velocity extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <DataLoader />
                <AppMenu />
                <main className={classes.content}>
                    <Toolbar className={classes.container}>
                        <QuerySelect />
                    </Toolbar>
                    <Grid container>
                        <ItemGrid xs={12} sm={12} md={12}>
                            <OverallVelocityWeeks
                                icon={ContentCopy}
                                iconColor="red"
                                title="Completed this week"
                                description="32"
                                small="Pts"
                                statIcon={LocalOffer}
                                statText="Add small chart showing velocity past 16 weeks"
                            />
                        </ItemGrid>
                    </Grid>
                    <Grid container>
                        <ItemGrid xs={12} sm={12} md={12}>
                            <OverallMemberVelocityWeeks
                                icon={ContentCopy}
                                iconColor="red"
                                title="Completed this week"
                                description="32"
                                small="Pts"
                                statIcon={LocalOffer}
                                statText="Add small chart showing velocity past 16 weeks"
                            />
                        </ItemGrid>
                    </Grid>
                </main>
            </div>
        );
    }
}

Velocity.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(Velocity)));