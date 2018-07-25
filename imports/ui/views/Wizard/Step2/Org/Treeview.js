import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import {cfgSources} from "../../../../data/Minimongo.js";

const styles = theme => ({

});

class Treeview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: [],
            expanded: [],
            nodes: [],
        };
    }

    componentDidMount() {
        const { repositories } = this.props;
        console.log(repositories);
        this.setState({
            nodes: this.getData(),
            checked: repositories.map(repo => repo.id),
        });
    }

    checkNode = async (checked) => {
        const { name } = this.props;
        await cfgSources.update({'org.login': name}, { $set: { active: false } }, {multi: true});
        checked.forEach(async (checkedId) => {
            let existNode = cfgSources.findOne({id: checkedId});
            if (existNode === undefined) {
                console.log('Need to create node');
            } else {
                await cfgSources.update({id: checkedId}, { $set: { active: true } }, {multi: false});
            }
        });
        this.setState({ checked });
    };

    getData(){
        const { repositories } = this.props;
        let allRepos = repositories;
        let uniqueOrgs = _.toArray(_.groupBy(allRepos, 'org.login'));
        let data = uniqueOrgs.map((org) => {
            return {
                label: org[0].org.login,
                value:org[0].org.login,
                children: org.map((repo) => {
                    return {
                        label: repo.name,
                        value: repo.id
                    };
                })
            };
        });
        return data;
    }

    render() {
        const { classes } = this.props;
        return (
            <div >
                <CheckboxTree
                    nodes={this.state.nodes}
                    checked={this.state.checked}
                    expanded={this.state.expanded}
                    onCheck={this.checkNode}
                    onExpand={expanded => this.setState({ expanded })}
                />
            </div>
        );
    }
}

Treeview.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    repositories: state.githubScanOrg.repositories,
    name: state.githubScanOrg.name,

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Treeview));