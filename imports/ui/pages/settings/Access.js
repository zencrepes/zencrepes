import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import { withTracker } from 'meteor/react-meteor-data';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import { Domain, Folder, NoteText } from 'mdi-material-ui';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

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

class Access extends Component {
    constructor(props) {
        super(props);
    };
/*
 <div className={classes.wrapper}>
 {totalLoading && <CircularProgress size={40} className={classes.fabProgress} />}
 </div>
 */
    render() {
        const { classes, totalOrgs, totalRepos, totalIssues, totalLoading } = this.props;
        let orgText = totalOrgs + " Organizations";
        let repoText = totalRepos + " Repositories";
        let issueText = totalIssues + " Issues";
        return (
            <Grid container spacing={8}>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <ListItem>
                                <ListItemIcon>
                                    <Domain />
                                </ListItemIcon>
                                <ListItemText primary={orgText} />
                            </ListItem>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <ListItem>
                                <ListItemIcon>
                                    <Folder />
                                </ListItemIcon>
                                <ListItemText primary={repoText} />
                            </ListItem>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <ListItem>
                                <ListItemIcon>
                                    <NoteText />
                                </ListItemIcon>
                                <ListItemText primary={issueText} />
                            </ListItem>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

const mapState = state => ({
    totalOrgs: state.github.totalOrgs,
    totalRepos: state.github.totalRepos,
    totalIssues: state.github.totalIssues,
    totalLoading: state.github.totalLoading,
});


export default connect(mapState, null)(withStyles(styles)(Access));