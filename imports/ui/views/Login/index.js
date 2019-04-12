import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { withTracker } from 'meteor/react-meteor-data';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import GitHubLogin from '../../components/Github/GitHubLogin.js';

import General from '../../layouts/General/index.js';
import pink from "@material-ui/core/colors/pink";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

import EmptyActions from '../../components/EmptyActions/index.js';

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
            width: 1000,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    title: {
        fontSize: '52px',
        lineHeight: 1.3,
    },
    underline: {
        margin: '18px 0',
        width: '100px',
        borderWidth: '2px',
        borderColor: '#27A0B6',
        borderTopStyle: 'solid',
    },
    subtitle: {
        fontSize: '20px',
        fontFamily: 'Roboto',
        fontWeight: 400,
        lineHeight: 1.5,
    },
    paragraph: {
        color: '#898989',
        lineHeight: 1.75,
        fontSize: '16px',
        margin: '0 0 10px',
        fontFamily: 'Roboto',
        fontWeight: 400,
    },
    paragraphSmall: {
        color: '#898989',
        lineHeight: 1,
        fontSize: '12px',
        margin: '10px 0 0 10px',
        fontFamily: 'Roboto',
        fontWeight: 400,
    },
    secondTitle: {
        fontSize: '20px',
        lineHeight: 1.1,
        fontWeight: 600,
        letterSpacing: '.75px',
    },
    notice: {
        margin: '10px 0 10px 10px',
        padding: '10px',
        backgroundColor: pink['A400'],
    },
    noticeText: {
        color: '#ffffff',
    }
});

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, authenticated } = this.props;
        return (
            <General>
                {authenticated &&
                    <Redirect to="/issues" />
                }
                <EmptyActions />
                <main className={classes.layout}>
                    <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={40}
                    >
                        <Grid item xs={12} sm={6} md={8}>
                            <h1 className={classes.title}>Log in to ZenCrepes</h1>
                            <div>
                                <hr className={classes.underline} />
                            </div>
                            <p className={classes.subtitle}>Agile analytics and management across GitHub organizations & repositories made easy!</p>
                            <p className={classes.paragraph}>Connect ZenCrepes to your favorite GitHub repositories and dive into your Agile metrics, search through your tickets, plan your sprints and get consistent labels and milestones across multiple repositories in just a few clicks.</p>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <h4 className={classes.secondTitle}>Get Started</h4>
                            <Paper className={classes.notice} elevation={1} color="secondary">
                                <Typography component="p" className={classes.noticeText}>
                                    Data is yours! ZenCrepes is <b><u>entirely client-side</u></b>, we don&apos;t see any of your data, none!
                                </Typography>
                            </Paper>
                            <GitHubLogin />
                            <p className={classes.paragraphSmall}>This library is distributed in the hope that it will be useful,
                                but WITHOUT ANY WARRANTY; without even the implied warranty of
                                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
                                Lesser General Public License for more details.</p>
                            <p className={classes.paragraphSmall}>By logging in, you are accepting the above-mentioned license.</p>
                        </Grid>
                    </Grid>
                </main>
            </General>
        );
    }

}

//export default withStyles(styles)(Login);

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired,
};


export default (
    withTracker(() => {
        const loggingIn = Meteor.loggingIn();
        const userId = Meteor.userId();

        return {
            authenticated: !loggingIn && !!userId,
        };
    })
    )(withRouter(withStyles(styles)(Login)));
