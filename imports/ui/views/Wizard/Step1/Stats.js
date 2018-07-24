import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';

import {cfgSources} from "../../../data/Minimongo.js";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class Stats extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    getRepos() {
        const { repos } = this.props;
        return repos.length
    }

    getOrgs() {
        const { repos } = this.props;
        return Object.keys(_.groupBy(repos, 'org.login')).length
    }

    getIssues() {
        const { repos } = this.props;
        return repos.map(repo => repo.issues.totalCount).reduce((acc, count) => acc + count, 0);
    }


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Typography component="p">
                    Selected: {this.getOrgs()} Orgs <br />
                    Selected: {this.getRepos()} Repos <br />
                    Will be loading: {this.getIssues()} Issues <br />
                </Typography>
            </div>
        );
    }
}

Stats.propTypes = {
    classes: PropTypes.object,
};


export default withTracker(() => {return {repos: cfgSources.find({active: true}).fetch()}})
(
    withStyles(styles)(Stats)
)