import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import { withTracker } from 'meteor/react-meteor-data';
import axios from 'axios';

import Button from '@material-ui/core/Button';

import { cfgIssues } from '../../data/Issues.js';
import {cfgSources} from "../../data/Repos";

import TextField from '@material-ui/core/TextField';

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

const loadWafflePoints = (issue) => {
    // Search for issue by number
    let existNode = cfgIssues.findOne({databaseId: issue.githubMetadata.id});
    if (existNode !== undefined && issue.size !== undefined) {
        console.log('updated points: ' + issue.size + ' for issue: ' + existNode.title + ' Closed At:' + existNode.closedAt);
        cfgIssues.update({id: existNode.id}, {$set:{'points':issue.size}});
    }
    /*
    console.log(issue.githubMetadata.id);
    console.log(issue);
    console.log(existNode);
    */
};

const loadZenhubPoints = (issue, repo) => {
    // Search for issue by number
    let existNode = cfgIssues.findOne({databaseId: issue.githubMetadata.id});
    if (existNode !== undefined && issue.size !== undefined) {
        console.log('updated points: ' + issue.size + ' for issue: ' + existNode.title + ' Closed At:' + existNode.closedAt);
        cfgIssues.update({id: existNode.id}, {$set:{'points':issue.size}});
    }
    /*
     console.log(issue.githubMetadata.id);
     console.log(issue);
     console.log(existNode);
     */
};

const loadZenhub = (token) => {
    console.log('loadZenhub()');

    let repositories = cfgSources.find({"org.name":{"$in":["Kids First Data Resource Center","Overture"]}}).fetch();
    repositories
        .filter(v => v.databaseId !== undefined)
        .forEach((repo) => {
            axios({
                method:'get',
                url: 'https://api.zenhub.io/p1/repositories/' + repo.databaseId + '/board',
                responseType:'json',
                headers: {'X-Authentication-Token': token},
            }).then(function(response) {
                console.log(response);
                //activeRepositories.push(repo);
                /*
                console.log(response);
                let issues = response.data.pipelines
                    .map(pipeline => pipeline.issues)
                    .reduce((a, b) => [...a, ...b], [])
                    .filter(v => v.estimate !== undefined);
                console.log(issues);
                //response.data.forEach((issue, repo) => {
                //    loadZenhubPoints(issue);
                //});
                */
            }).catch(function (error) {
                console.log(error);
            });

        });
};

const loadWaffle = () => {
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
                loadWafflePoints(issue);
            });
        }).catch(function (error) {
            console.log(error);
        });

    });
};

class Metadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenValue: '',
            tokenError: false,
            tokenHelperText: 'Enter your zenhub API token',
        };
    };

    updateToken = name => event => {
        console.log('updateToken');
        //Search for existing query name
        this.setState({
            ['tokenValue']: event.target.value,
        });

    };


    loadMetadata = () => {
        const { tokenValue } = this.state;
        console.log('loadMetadata()');
        //loadWaffle();
        if (tokenValue !== '') {
            loadZenhub(tokenValue);
        }
    };

    render() {
        const { classes } = this.props;
        const { tokenValue, tokenError, tokenHelperText } = this.state;

        return (
            <div>
            <Button variant="raised" size="small" color="primary" onClick={() => this.loadMetadata()}>
                Load Metadata
            </Button>
                <TextField
                    id="full-width"
                    label="Query Name"
                    error={tokenError}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={classes.textField}
                    helperText={tokenHelperText}
                    fullWidth
                    margin="normal"
                    onChange={this.updateToken()}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Metadata);