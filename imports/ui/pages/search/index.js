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

import Facets from './Facets.js';


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
        if (this.state.sourcesInit === false) {
            this.state.sourcesInit = true;
            const issues = new Issues(this.props);
            issues.load();
        };
    }

    render() {
        const { classes } = this.props;
        if (cfgSources.find({'active': true}).count() > 0 ) {
            return (
                <div className={classes.root}>
                    <AppMenu />
                    <LeftDrawer />
                    <main className={classes.content}>
                        <Facets />
                        <h1> There is some content available </h1>
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

const mapDispatch = dispatch => ({
    updateChip: dispatch.chip.updateChip,
    incrementUnfilteredIssues: dispatch.github.incrementUnfilteredIssues,
    updateIssuesLoading: dispatch.github.updateIssuesLoading,
});

export default connect(null, mapDispatch)(withStyles(styles)(withApollo(Search)));