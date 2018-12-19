import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {BrowserRouter as Router, Link, Route, withRouter} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { withTracker } from 'meteor/react-meteor-data';

import {
    Settings,
    Calendar,
    ChartLine,
    ChartHistogram,
    ViewDashboard,
    Label,
    AutoFix,
    RunFast,
    GithubCircle
} from 'mdi-material-ui';

import UserMenu from './UserMenu.js';


const style = theme => ({
    root: {
    },

    appBar: {
        position: 'relative',
    },
    toolbarButtons: {
        flex: 1,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class Header extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, authenticated } = this.props;

        const routes = [
            {path: '/issues', icon: (<ViewDashboard className={classes.leftIcon} />), text: 'Issues', key: 'issues'},
            {path: '/sprints', icon: (<RunFast className={classes.leftIcon} />), text: 'Sprints', key: 'sprint'},
            {path: '/labels', icon: (<Label className={classes.leftIcon} />), text: 'Labels', key: 'labels'},
            {path: '/milestones', icon: (<Calendar className={classes.leftIcon} />), text: 'Milestones', key: 'milestones'},
            {path: '/settings', icon: (<Settings className={classes.leftIcon} />), text: 'Settings', key: 'settings'},
        ];
        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="static" color="default" className={classes.appBar}>
                    <Toolbar>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            spacing={8}
                        >
                            <Grid item >
                                <Typography variant="h5" color="inherit" noWrap className={classes.toolbarTitle}>
                                    <Link to={"/issues"}>ZenCrepes</Link>
                                </Typography>
                            </Grid>
                            {authenticated &&
                                <React.Fragment>
                                    <Grid item xs={12} sm container >
                                        <Grid
                                            container
                                            direction="row"
                                            justify="flex-start"
                                            alignItems="flex-start"
                                            spacing={8}
                                        >
                                            {routes.map((route) => {
                                                let buttonColor = 'default';
                                                if (route.key === 'TODO') { // Implement color selection based on path
                                                    buttonColor = 'primary';
                                                }
                                                return (
                                                    <Grid item key={route.key}>
                                                        <Button color={buttonColor} className={classes.button} component={Link} to={route.path} >
                                                            {route.icon}
                                                            {route.text}
                                                        </Button>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </Grid>

                                    <Grid item >
                                        <UserMenu />
                                    </Grid>
                                </React.Fragment>
                            }
                        </Grid>
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (
    withTracker(() => {
        const loggingIn = Meteor.loggingIn();
        const userId = Meteor.userId();

        return {
            authenticated: !loggingIn && !!userId,
        };
    })
    )(withRouter(withStyles(style)(Header)));


/*
            <div className={classes.root}>
                <AppBar position="static" color="default" className={classes.appBar}>
                    <Toolbar>
                        <div className={classes.toolbarButtons}>
                            {routes.map((route) => {
                                let buttonColor = 'default';
                                if (route.key === 'TODO') { // Implement color selection based on path
                                    buttonColor = 'primary';
                                }
                                return (
                                    <Button color={buttonColor} className={classes.button} component={Link} to={route.path} key={route.key}>
                                        {route.icon}
                                        {route.text}
                                    </Button>
                                );
                            })}
                        </div>

                        <UserMenu />
                    </Toolbar>
                </AppBar>
            </div>
 */