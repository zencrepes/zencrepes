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

import { graphql, Query } from 'react-apollo';
import { connect } from "react-redux";

import GET_USER_DATA from '../../../graphql/getUser.graphql';
import GET_GITHUB_ORGS from '../../../graphql/getOrgs.graphql';
//export const cfgSources = new Mongo.Collection('cfgSources', {connection: null});
//export const localCfgSource = new PersistentMinimongo2(cfgSource, 'github-agile-view');

import OrgRepoTree from '../../components/OrgRepoTree/index.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 430,
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
    mdlDemo: { //https://dowjones.github.io/react-dropdown-tree-select/#/story/with-material-design-styles
        fontSize: '12px',
        color: '#555'
    }

});

const data = {
    label: 'search me',
    value: 'searchme',
    children: [
        {
            label: 'search me too',
            value: 'searchmetoo',
            children: [
                {
                    label: 'No one can get me',
                    value: 'anonymous'
                }
            ]
        }
    ]
}

const onChange = (currentNode, selectedNodes) => {
    console.log("currentNode::", currentNode);
    console.log("selectedNodes::", selectedNodes);
};

const assignObjectPaths = (obj, stack) => {
    Object.keys(obj).forEach(k => {
        const node = obj[k];
        if (typeof node === "object") {
            node.path = stack ? `${stack}.${k}` : k;
            assignObjectPaths(node, node.path);
        }
    });
};

//<Query query={GET_GITHUB_ORGS} children={({ loading, error, data }) => <OrgRepoTree data={data}/>} />
class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {sourcesInit: false};
    }

    /*
    static getDerivedStateFromProps(nextProps, prevState) {
        const { client, updateChip } = nextProps;
        console.log(nextProps);
        console.log(this.state);
        //updateChip(data.rateLimit);
        return null;
    }
    */
     componentDidMount() {
        if (this.state.sourcesInit === false) {
            this.state.sourcesInit = true;
            const sources = new Sources(this.props);
            sources.load();
        };
//        console.log('component did mount');
//        console.log(this.state);
    }


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppMenu />
                <LeftDrawer />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <OrgRepoTree />
                    <DropdownTreeSelect data={data} onChange={onChange} className={classes.mdlDemo} />
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
});

export default connect(null, mapDispatch)(withStyles(styles)(withApollo(Settings)));