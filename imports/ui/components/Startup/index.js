import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';

import { withStyles } from 'material-ui/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import { cfgLabels } from "../../data/Minimongo.js";
import { cfgQueries } from "../../data/Minimongo.js";
import { cfgSources } from "../../data/Minimongo.js";
import { cfgIssues } from "../../data/Minimongo.js";

const styles = theme => ({
    root: {
    }
});

class Startup extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            classes,
            loadedIssues,
            loadedSources,
            loadedLabels,
            loadedQueries,
            issuesCount,
            labelsCount,
            queriesCount,
            sourcesCount
        } = this.props;

        return (
            <Dialog aria-labelledby="simple-dialog-title" open={true}>
                <DialogTitle id="simple-dialog-title">Starting up the app ...</DialogTitle>
                <DialogContent>
                    <div>
                        Issues: {issuesCount} {loadedIssues && <i>- Complete</i>} <br />
                        Labels: {labelsCount} {loadedLabels && <i>- Complete</i>} <br />
                        Queries: {queriesCount} {loadedQueries && <i>- Complete</i>} <br />
                        Repos: {sourcesCount} {loadedSources && <i>- Complete</i>} <br />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

Startup.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    loadedIssues: state.startup.loadedIssues,
    loadedSources: state.startup.loadedSources,
    loadedLabels: state.startup.loadedLabels,
    loadedQueries: state.startup.loadedQueries,
});

export default
    connect(mapState, null)
    (
        withTracker(() => {return {
            issuesCount: cfgIssues.find({}).count(),
            labelsCount: cfgLabels.find({}).count(),
            queriesCount: cfgQueries.find({}).count(),
            sourcesCount: cfgSources.find({}).count(),
        }})
        (
            withStyles(styles)(Startup)
        )
    );
