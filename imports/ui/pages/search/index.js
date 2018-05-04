import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";

import AppMenu from '../../components/AppMenu/index.js';
import LeftDrawer from '../../components/LeftDrawer/index.js'
import { cfgSources } from '../../data/Repositories.js';

import NoRepos from '../../components/Dialogs/NoRepos.js';

import Issues, { cfgIssues } from '../../data/Issues.js';
import Grid from 'material-ui/Grid';
import Facets from '../../components/Facets/index.js';
import Query from '../../components/Query/index.js';
import IssuesTable from '../../components/Table/index.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        paddingTop: 80,
        minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
});

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {sourcesInit: false};
    }

    componentDidMount() {
        const { loadIssues, setLoadIssues } = this.props;
        if (loadIssues === true || cfgIssues.find({}).count() === 0) {
            setLoadIssues(false);
            const issues = new Issues(this.props);
            issues.load();
        }
    }

    render() {
        const { classes } = this.props;
        if (cfgSources.find({'active': true}).count() > 0 ) {
            return (
                <div className={classes.root}>
                    <AppMenu />
                    <LeftDrawer />
                    <main className={classes.content}>
                        <Grid container spacing={8}>
                            <Grid item xs={12}>
                                <Query />
                            </Grid>
                            <Grid item xs={4}>
                                <Facets />
                            </Grid>
                            <Grid item xs={8}>
                                <IssuesTable />
                            </Grid>
                        </Grid>
                    </main>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <AppMenu />
                    <LeftDrawer />
                    <main className={classes.content}>
                        <NoRepos />
                    </main>
                </div>
            );
        }
    }
}

Search.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    rateLimit: PropTypes.object,
    updateChip: PropTypes.func,
};

const mapState = state => ({
    loadIssues: state.github.loadIssues,
});

const mapDispatch = dispatch => ({
    updateChip: dispatch.chip.updateChip,
    incrementUnfilteredIssues: dispatch.github.incrementUnfilteredIssues,
    updateIssuesLoading: dispatch.github.updateIssuesLoading,
    setLoadIssues: dispatch.github.setLoadIssues,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(withApollo(Search)));