import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { connect } from "react-redux";
import { withTracker } from 'meteor/react-meteor-data';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import {Treebeard, decorators} from 'react-treebeard';

import { CheckboxBlankOutline, CheckboxMarkedOutline } from 'mdi-material-ui';

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

decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base} onClick={this.onClick}>
            {node.active ? (
                <CheckboxMarkedOutline />
            ) : (
                <CheckboxBlankOutline />
            )}
            {node.name}
        </div>
    );
};

class OrgRepoTree extends Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
        this.toggled = {};
    }

    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ this.toggled[node.id] = toggled; }
        this.setState({ cursor: node });
        console.log(node);
    }

    onClick(node){
        console.log("test");
        console.log(node);
    }

    getData() {
        let data = [];
        let orgIssuesCount = {};
        if (cfgSources !== undefined) {
            cfgSources.find({}).forEach((repo) => {
                let orgIdx = _.findIndex(data, { 'value': repo.org.id});
                if (orgIdx === -1 ) {
                    data.push({
                        name: repo.org.name,
                        value: repo.org.id,
                        id: repo.org.id,
                        toggled: this.toggled[repo.org.id],
                        children: [],
                    });
                    orgIssuesCount[repo.org.id] = 0
                    orgIdx = data.length -1;
                }
                data[orgIdx].children.push({
                    name: repo.name + ' (' + repo.issues_count + ')',
                    value: repo.id,
                    id: repo.id,
                });
                orgIssuesCount[repo.org.id] = orgIssuesCount[repo.org.id] + repo.issues_count;
                data[orgIdx]['name'] = repo.org.name + " (" + orgIssuesCount[repo.org.id] + ")";
            });
        }
        return data;
    }

    render() {
        const { classes, totalLoading, totalOrgs, totalRepos, totalIssues } = this.props;
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
                        <Treebeard data={this.getData()} onToggle={this.onToggle} decorators={decorators} />
                    </CardContent>
                </Card>
            );
        }
    }
}
// <DropdownTreeSelect data={this.getData()} onChange={onChange} className={classes.mdlDemo} />
const mapState = state => ({
    totalLoading: state.github.totalLoading,
});

export default connect(mapState, null)(withStyles(styles)(OrgRepoTree));


