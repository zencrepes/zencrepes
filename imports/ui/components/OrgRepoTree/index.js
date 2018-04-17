import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { connect } from "react-redux";
import { withTracker } from 'meteor/react-meteor-data';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import DropdownTreeSelect from 'react-dropdown-tree-select';

import { cfgSources} from '../../data/Repositories.js';
import _ from 'lodash'

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

            cfgSources.find({}).forEach((repo) => {
                let orgIdx = _.findIndex(data, { 'value': repo.org.id});
                if (orgIdx === -1 ) {
                    data.push({
                        label: repo.org.name,
                        value: repo.org.id,
                        children: [],
                    });
                    orgIdx = data.length -1;
                }
                data[orgIdx].children.push({
                    label: repo.name,
                    value: repo.id,
                });

                /*
                let repos = [];
                let issueCount = 0;
                issue.repos.forEach((repo) => {
                    repos.push({
                        label: repo.name + " (" + repo.issues_count + ")",
                        value: repo.id,
                    })
                    issueCount = issueCount + repo.issues_count;
                });
                data.push({
                    label: issue.login + " (" + issueCount + ")",
                    value: issue._id,
                    children: repos,
                })
                */
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


