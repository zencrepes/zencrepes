import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import Button from 'material-ui/Button';
import AppMenu from '../../components/AppMenu/index.js';
import LeftDrawer from '../../components/LeftDrawer/index.js'
import Typography from 'material-ui/Typography';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css';

import { withApollo } from 'react-apollo';

import Sources from '../../data/Sources.js';

import Grid from 'material-ui/Grid';

import { graphql, Query } from 'react-apollo';
import { connect } from "react-redux";

import GET_USER_DATA from '../../../graphql/getUser.graphql';
import GET_GITHUB_ORGS from '../../../graphql/getOrgs.graphql';
//export const cfgSources = new Mongo.Collection('cfgSources', {connection: null});
//export const localCfgSource = new PersistentMinimongo2(cfgSource, 'github-agile-view');

import OrgRepoTree from '../../components/OrgRepoTree/index.js';
import Access from './Access.js';
import GitRequests from '../../components/Github/GitRequests.js';

import LoadingIssues from '../../components/Loading/Issues/index.js';
import LoadingRepos from '../../components/Loading/Repos/index.js';

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

//<Query query={GET_GITHUB_ORGS} children={({ loading, error, data }) => <OrgRepoTree data={data}/>} />
class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {sourcesInit: false};
    }

    componentDidMount() {
        console.log(this.props);
        /*
        if (this.state.sourcesInit === false) {
            this.state.sourcesInit = true;
            const sources = new Sources(this.props);
            sources.load();
        };
        */
    }


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <LoadingIssues />
                <LoadingRepos />
                <AppMenu />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <Access />
                        </Grid>
                        <Grid item xs={6}>
                            <OrgRepoTree client={this.props.client}/>
                        </Grid>
                        <Grid item xs={12}>
                            <GitRequests />
                        </Grid>
                    </Grid>
                </main>
            </div>
        );
    }
}

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    rateLimit: PropTypes.object,
    updateChip: PropTypes.func,
};

const mapDispatch = dispatch => ({
    updateChip: dispatch.chip.updateChip,
    incrementTotalOrgs: dispatch.github.incrementTotalOrgs,
    incrementTotalRepos: dispatch.github.incrementTotalRepos,
    incrementTotalIssues: dispatch.github.incrementTotalIssues,
    setTotalRepos: dispatch.github.setTotalRepos,
    setTotalIssues: dispatch.github.setTotalIssues,
    setTotalOrgs: dispatch.github.setTotalOrgs,
    updateTotalLoading: dispatch.github.updateTotalLoading,
});

export default connect(null, mapDispatch)(withStyles(styles)(withApollo(Settings)));
