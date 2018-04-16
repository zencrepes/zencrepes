import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import { graphql } from 'react-apollo';
import { connect } from "react-redux";
import { GithubCircle, Logout } from 'mdi-material-ui'

import { withTracker } from 'meteor/react-meteor-data';

import { withApollo } from 'react-apollo';
import Sources from '../../data/Sources.js';
import { cfgSources } from '../../data/Sources.js';


import GET_USER_DATA from '../../../graphql/getUser.graphql';

const styles = {
    root: {
        flexGrow: 1,
    },
};

class OrgRepoTree extends Component {
    state= { };

    render() {
        const { totalOrgs, totalRepos, totalIssues } = this.props;
        //console.log(this.props);
        return (
            <div>
                You have access to {totalOrgs} Organizations and {totalRepos} Repositories and {totalIssues} Issues
                <h1>OrgRepoTree</h1>
            </div>
        );
    }
}

const mapState = state => ({
    totalOrgs: state.github.totalOrgs,
    totalRepos: state.github.totalRepos,
    totalIssues: state.github.totalIssues,
});

const mapDispatch = dispatch => ({
    updateChip: dispatch.chip.updateChip
});

export default connect(mapState, mapDispatch)(withStyles(styles)(OrgRepoTree));


/*

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
};



class OrgRepoTree extends React.Component {
    static getDerivedStateFromProps(nextProps, prevState) {
        const { rateLimit, updateChip } = nextProps;
        console.log(nextProps);
        console.log(prevState);
//        console.log(rateLimit);
//        console.log(updateChip);
//        updateChip(rateLimit);
        return null;
    }

    render() {
        console.log(this.props);
        return (
            <h1>Some Test </h1>
        );
    }
}

OrgRepoTree.propTypes = {
    classes: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    rateLimit: PropTypes.object,
    updateChip: PropTypes.func,
};

const mapDispatch = dispatch => ({
    updateChip: dispatch.chip.updateChip
});

export default connect(null, mapDispatch)(withStyles(styles)(OrgRepoTree));
*/