import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { connect } from "react-redux";
import { withTracker } from 'meteor/react-meteor-data';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import DropdownTreeSelect from 'react-dropdown-tree-select';

import { cfgSources} from '../../data/Sources.js';

const styles = {
    root: {
        flexGrow: 1,
    },
    progress: {
        margin: 10,
    },
    mdlDemo: { //https://dowjones.github.io/react-dropdown-tree-select/#/story/with-material-design-styles
        fontSize: '12px',
        color: '#555'
    }
};

const onChange = (currentNode, selectedNodes) => {
    console.log("currentNode::", currentNode);
    console.log("selectedNodes::", selectedNodes);
};

class OrgRepoTree extends Component {
    state= { };

    getData() {
        let data = [];
        console.log(cfgSources);
        if (cfgSources !== undefined) {
            cfgSources.find({}).forEach((issue) => {
                let repos = []
                Object.entries(issue.repos).forEach((repo) => {
                    repos.push({
                        label: repo.name,
                        value: repo.id,
                    })
                });
                /*
                 name: currentOrg.node.name,
                 login: currentOrg.node.login,
                 url: currentOrg.node.url,
                 repo_count: currentOrg.node.repositories.totalCount,
                 */

                data.push({
                    label: issue.login,
                    value: issue._id,
                    children: repos,
                })
            });
        }
        return data;
    }

    render() {
        const { classes, totalLoading, totalOrgs, totalRepos, totalIssues } = this.props;
        console.log(totalLoading);
        if (totalLoading) {
            return (
                <Card className={classes.card}>
                    <CardContent>
                        <CircularProgress className={classes.progress} /> Loading ...
                    </CardContent>
                </Card>
            );
        } else {
            return (
                <Card className={classes.card}>
                    <CardContent>
                        <DropdownTreeSelect data={this.getData()} onChange={onChange} className={classes.mdlDemo} />
                    </CardContent>
                </Card>
            );
        }
    }
}

const mapState = state => ({
    totalLoading: state.github.totalLoading,
});

export default connect(mapState, null)(withStyles(styles)(OrgRepoTree));


