import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import { withTracker } from 'meteor/react-meteor-data';
import axios from 'axios';
import { connect } from "react-redux";

import Button from '@material-ui/core/Button';

import { cfgIssues } from '../../data/Minimongo.js';
import { cfgSources } from "../../data/Minimongo.js";

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

    //let issues = [];
    let callCount = 0;
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
            callCount++;
            let boardIssues = response.data.pipelines
                .map(pipeline => pipeline.issues)
                .reduce((a, b) => [...a, ...b], []);

            console.log(boardIssues);
            if (boardIssues.length > 0) {
                //Get issues, in this repo, with points === null;
                //issues.push(cfgIssues.find({'repo.databaseId': repo.databaseId, point: null, number: { "$nin": [ null, "" ] }}).fetch());
                let issues = cfgIssues.find({'repo.databaseId': repo.databaseId, point: null, number: { "$nin": [ null, "" ] }}).fetch();
                //let issues = [cfgIssues.findOne({'repo.databaseId': repo.databaseId, point: null, number: { "$nin": [ null, "" ] }})];
                console.log(issues);

                issues.forEach(async (issue) => {
                    callCount++;
                    console.log(issue);
                    if (callCount > 50) {
                        console.log('Going to wait for 60 seconds');
                        await timeOut(60000); // Pause for 60 seconds due to ZenHub rate limit
                        callCount = 0;
                    }
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
    /*
    if (issues.length > 0) {
        issues.reduce((a, b) => [...a, ...b], []);
        console.log(issues);
        issues.forEach(async (issue) => {
            console.log(issue);
            if (callCount > 95) {
                await timeOut(60000); // Pause for 60 seconds due to ZenHub rate limit
                callCount = 0;
            }
            if (issue !== undefined) {
                callCount++;
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
        });
    }
    console.log('DONE');*/
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

        const { setToken } = this.props;
        setToken(event.target.value);
        //Search for existing query name
        /*
        this.setState({
            ['tokenValue']: event.target.value,
        });*/

    };


    loadMetadata = () => {
        console.log('loadMetadata()');

        const { zenhubInitStates } = this.props;

        loadWaffle();

        zenhubInitStates();
        //if (tokenValue !== '') {
        //    loadZenhub(tokenValue);
        //}
    };

    render() {
        const { classes, token } = this.props;

        return (
            <div>
            <Button variant="raised" size="small" color="primary" onClick={() => this.loadMetadata()}>
                Load Metadata
            </Button>
                <TextField
                    id="full-width"
                    label="Query Name"
                    error={false}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={token}
                    className={classes.textField}
                    helperText='Please enter your zenhub token'
                    fullWidth
                    margin="normal"
                    onChange={this.updateToken()}
                />
            </div>
        );
    }
}

const mapState = state => ({
    token: state.zenhub.token,

});

const mapDispatch = dispatch => ({
    zenhubInitStates: dispatch.zenhub.initStates,
    setToken: dispatch.zenhub.setToken,

});

export default connect(mapState, mapDispatch)(withStyles(styles)(Metadata));

