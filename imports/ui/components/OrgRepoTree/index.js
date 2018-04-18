import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { connect } from "react-redux";
import { withTracker } from 'meteor/react-meteor-data';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import {Treebeard, decorators} from 'react-treebeard';
import {Tree} from 'primereact/components/tree/Tree';
import primeClass from 'primereact/components/tree/Tree.css';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';

import { CheckboxBlankOutline, CheckboxMarkedOutline } from 'mdi-material-ui';

import { cfgSources} from '../../data/Repositories.js';
import _ from 'lodash';

//https://github.com/primefaces/primereact/blob/75ebcc93a37918fee88578b77e70fa6d94207332/src/components/tree/Tree.css

const styles = {
    root: {
        flexGrow: 1,
    },
    progress: {
        margin: 10,
    },
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
        <div style={style.base} >
            {node.active ? (
                <CheckboxMarkedOutline onClick={this.onClick}/>
            ) : (
                <CheckboxBlankOutline onClick={this.onClick}/>
            )}
            {node.name}
        </div>
    );
};

class OrgRepoTree extends Component {
    constructor(props){
        super(props);
        this.state = { selectedFile: null, selectedFiles1: [], selectedFiles2: [], selectedFile3: null };
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
                let orgIdx = _.findIndex(data, { 'data': repo.org.id});
                if (orgIdx === -1 ) {
                    data.push({
                        label: repo.org.name,
                        data: repo.org.id,
                        id: repo.org.id,
//                        expandedIcon: 'fa-folder-open',
//                        collapsedIcon: 'fa-folder',
                        toggled: this.toggled[repo.org.id],
                        children: [],
                    });
                    orgIssuesCount[repo.org.id] = 0
                    orgIdx = data.length -1;
                }
                data[orgIdx].children.push({
                    label: repo.name + ' (' + repo.issues_count + ')',
                    data: repo.id,
                    id: repo.id,
                });
                orgIssuesCount[repo.org.id] = orgIssuesCount[repo.org.id] + repo.issues_count;
                data[orgIdx]['label'] = repo.org.name + " (" + orgIssuesCount[repo.org.id] + ")";
            });
        }
        return data;
    }

    onCheckboxSelectionChange(e) {
        console.log(e);
        this.setState({ selectedFiles2: e.selection });
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
                        <Tree value={this.getData()} selectionMode="checkbox" selectionChange={this.onCheckboxSelectionChange.bind(this)} ></Tree>
                    </CardContent>
                </Card>
            );
        }
    }
}
/*
 ui-tree	Main container element
 ui-tree-horizontal	Main container element in horizontal mode
 ui-tree-container	Container of nodes
 ui-treenode	A treenode element
 ui-treenode-content	Content of a treenode
 ui-treenode-toggler	Toggle icon
 ui-treenode-icon	Icon of a treenode
 ui-treenode-label	Label of a treenode
 ui-treenode-children
 <Tree value={this.getData()} selectionMode="checkbox" selectionChange={this.onCheckboxSelectionChange.bind(this)} className={{uiTree: classes.uiTree,uiTreeContainer: classes.uiTreeContainer,uiTreenode: classes.uiTreenode,uiTreenodeContent: classes.uiTreenodeContent,uiTreenodeToggler: classes.uiTreenodeToggler,uiTreenodeIcon: classes.uiTreenodeIcon,uiTreenodeLabel: classes.uiTreenodLabel,uiTreenodeChildren: classes.uiTreenodeChildren}}></Tree>

 */


//classes={{paper: this.props.classes.paper, anchorLeft: this.props.classes.anchorLeft}}
// <DropdownTreeSelect data={this.getData()} onChange={onChange} className={classes.mdlDemo} />
//<Treebeard data={this.getData()} onToggle={this.onToggle} decorators={decorators} />
const mapState = state => ({
    totalLoading: state.github.totalLoading,
});

export default connect(mapState, null)(withStyles(styles)(OrgRepoTree));


