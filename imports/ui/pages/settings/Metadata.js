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

function timeOut(ms) {
    return new Promise((fulfill) => {
        setTimeout(fulfill, ms);
    });
}

const loadZenhub = (token) => {
    console.log('loadZenhub()');

    let repositories = cfgSources.find({"org.name":{"$in":["Kids First Data Resource Center","Overture"]}}).fetch();
    repositories
        .filter(v => v.databaseId !== undefined)
        .forEach(async (repo) => {
            let response = await axios({
                method:'get',
                url: 'https://api.zenhub.io/p1/repositories/' + repo.databaseId + '/board',
                responseType:'json',
                headers: {'X-Authentication-Token': token},
            });
            let boardIssues = response.data.pipelines
                .map(pipeline => pipeline.issues)
                .reduce((a, b) => [...a, ...b], []);

            console.log(boardIssues);
            if (boardIssues.length > 0) {
                //Get issues, in this repo, with points === null;
                let issues = cfgIssues.find({'repo.databaseId': repo.databaseId, point: null, number: { "$nin": [ null, "" ] }}).fetch();
                //let issues = [cfgIssues.findOne({'repo.databaseId': repo.databaseId, point: null, number: { "$nin": [ null, "" ] }})];
                console.log(issues);
                issues.forEach(async (issue) => {
                    if (issue !== undefined) {
                        let response = await axios({
                            method:'get',
                            url: 'https://api.zenhub.io/p1/repositories/' + repo.databaseId + '/issues/' + issue.number,
                            responseType:'json',
                            headers: {'X-Authentication-Token': token},
                        });

                        if (response.data.estimate !== undefined) {
                            cfgIssues.update({id: issue.id}, {$set:{'points':response.data.estimate.value}});
                            console.log('Updated ' + response.data.estimate.value + ' points to: ' + issue.title);
                        }
                    }
                    await timeOut(1000);
                });
            } else {
                console.log('Repo does not contain any issue, skipping');
            }
            //    return issues.length;
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
            //}).catch(function (error) {
            //    console.log(error);
            //    return 0;
            //});


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