import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import { withTracker } from 'meteor/react-meteor-data';
import axios from 'axios';

import Button from '@material-ui/core/Button';

import { cfgIssues } from '../../data/Issues.js';
import {cfgSources} from "../../data/Repos";


const styles = {
    root: {
        flexGrow: 1,
    },
    card: {
        minWidth: 10,
    },
    wrapper: {
        margin: 10,
        position: 'relative',
    },
};

const loadPoints = (issue) => {
    // Search for issue by number
    let existNode = cfgIssues.findOne({databaseId: issue.githubMetadata.id});
    if (existNode !== undefined && issue.size !== undefined) {
        console.log('updated points: ' + issue.size + ' for issue: ' + existNode.title);
        cfgIssues.update({id: existNode.id}, {$set:{'points':issue.size}});
    }
    /*
    console.log(issue.githubMetadata.id);
    console.log(issue);
    console.log(existNode);
    */
};

class Metadata extends Component {
    constructor(props) {
        super(props);
    };

    loadMetadata() {
        console.log('loadMetadata()');
        pointsLocation = [
            'https://api.waffle.io/nci-hcmi-catalog/portal/cards',
            'https://api.waffle.io/overture-stack/roadmap/cards'
        ];
        //Make get call to: https://api.waffle.io/overture-stack/roadmap/cards
        pointsLocation.forEach((location) => {
            axios({
                method:'get',
                url: location,
                responseType:'json'
            }).then(function(response) {
                response.data.forEach((issue) => {
                    loadPoints(issue);
                });
            });
        });

    };

    render() {
        const { classes } = this.props;

        return (
            <Button variant="raised" size="small" color="primary" onClick={this.loadMetadata}>
                Load Metadata
            </Button>
        );
    }
}

export default withStyles(styles)(Metadata);