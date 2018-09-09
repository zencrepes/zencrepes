import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import {connect} from "react-redux";
import PropTypes from "prop-types";

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import { cfgSources } from "../../../../data/Minimongo.js";
import Card from "@material-ui/core/Card";
import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import Typography from '@material-ui/core/Typography';

import Stats from './Stats.js';
import Tree from './Tree.js';
import {withRouter} from "react-router-dom";
import sidebarStyle from "../../../../assets/jss/material-dashboard-react/components/sidebarStyle";

const styles = theme => ({
    root: {
        margin: '10px',
    },
    card: {
        height: '380px',
        overflow: 'auto',
    },
    title: {
        fontSize: 14,
    },
    cardContent: {
        paddingBottom: '0px',
    },
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
        const { selected } = this.props;
        this.setState({
            nodes: this.getData(),
            checked: cfgSources.find(selected).fetch().map(repo => repo.id),
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { selected } = this.props;
        const updatedNodes = this.getData();
        if (!_.isEqual(updatedNodes, prevState.nodes)) {
            this.setState({
                nodes: this.getData(),
                checked: cfgSources.find(selected).fetch().map(repo => repo.id),
            });
        }
    };

    checkNode = async (checked) => {
        const { all, enable, disable } = this.props;
        await cfgSources.update(all, { $set: disable }, {multi: true});
        checked.forEach(async (checkedId) => {
            await cfgSources.update({id: checkedId}, { $set: enable }, {multi: false});
        });
        this.setState({ checked });
    };

    getData(){
        const { all } = this.props;
        let allRepos = cfgSources.find(all).fetch();
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
    };

    render() {
        const { classes, all, selected, enable, disable } = this.props;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent} >
                        <Typography className={classes.title} color="textSecondary">
                            Available Organizations and Repositories
                        </Typography>
                        <Tree all={all} selected={selected} enable={enable} disable={disable} />
                        <Stats/>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Treeview.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({
    loadingOrgs: state.githubFetchOrgs.loading,
    loadingOrgRepos: state.githubFetchOrgRepos.loading,
    loadingRepo: state.githubFetchRepo.loading,
});

export default connect(mapState, null)(withStyles(styles)(Treeview));