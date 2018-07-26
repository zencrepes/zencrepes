import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import { cfgSources } from "../../../data/Minimongo.js";

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
        this.setState({
            nodes: this.getData(),
            checked: cfgSources.find({active: true}).fetch().map(repo => repo.id),
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const updatedNodes = this.getData();
        if (!_.isEqual(updatedNodes, prevState.nodes)) {
            this.setState({
                nodes: this.getData(),
                checked: cfgSources.find({active: true}).fetch().map(repo => repo.id),
            });
        }
    }

    checkNode = async (checked) => {
        await cfgSources.update({}, { $set: { active: false } }, {multi: true});
        checked.forEach(async (checkedId) => {
            await cfgSources.update({id: checkedId}, { $set: { active: true } }, {multi: false});
        });
        this.setState({ checked });
    };

    getData(){
        let allRepos = cfgSources.find({}).fetch();
        let uniqueOrgs = _.toArray(_.groupBy(allRepos, 'org.login'));
        let data = uniqueOrgs.map((org) => {
            return {
                label: org[0].org.name,
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

/*
const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Treeview));
*/
export default withTracker(() => {return {repos: cfgSources.find({}).fetch()}})
(
    withStyles(styles)(Treeview)
)