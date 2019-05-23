import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import {
    Settings,
    Calendar,
    ViewDashboard,
    Label,
    ChartGantt,
    DeveloperBoard,
    SourcePull,
} from 'mdi-material-ui';

import UserMenu from './UserMenu.js';
import {connect} from "react-redux";
import red from "@material-ui/core/colors/red";

import {reactLocalStorage} from 'reactjs-localstorage';

const style = theme => ({
    root: {
    },
    appBar: {
        position: 'relative',
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    buttonBase: {
        margin: theme.spacing.unit,
    },
    currentPath: {
        borderBottom: '2px solid ' + red[900],
    },
    menuLink: {
        textDecoration: "none",
    }
});

class Header extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, authenticated, menus } = this.props;

        const routes = [
            {path: '/issues', icon: (<ViewDashboard className={classes.leftIcon} />), text: 'Issues', key: 'issues'},
            {path: '/projects', icon: (<DeveloperBoard className={classes.leftIcon} />), text: 'Projects', key: 'projects'},
            {path: '/milestones', icon: (<Calendar className={classes.leftIcon} />), text: 'Milestones', key: 'milestones'},
            {path: '/pullrequests', icon: (<SourcePull className={classes.leftIcon} />), text: 'PRs (dev)', key: 'pullrequests'},
            {path: '/roadmap', icon: (<ChartGantt className={classes.leftIcon} />), text: 'Roadmap (dev)', key: 'roadmap'},
            {path: '/labels', icon: (<Label className={classes.leftIcon} />), text: 'Labels', key: 'labels'},
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
                                    <Link to={"/issues"} className={classes.menuLink} >ZenCrepes</Link>
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
                                            {routes.filter((route) => {
                                                // First one is to hide something behind a feature flag
                                                if (JSON.parse(reactLocalStorage.get('enableExperimental', false))) {return true;}
                                                else if (reactLocalStorage.get('feat-' + route.key, false)) {return true;}
                                                else if (_.isEmpty(menus)) {return true;}
                                                else if (menus[route.key] !== undefined && menus[route.key] === true) {
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            }).map((route) => {
                                                if (this.props.location.pathname === route.path || this.props.location.pathname === route.path.slice(0, -1)) { // Implement color selection based on path
                                                    return (
                                                        <Grid item key={route.key} className={classes.currentPath}>
                                                            <Button color="secondary" className={classes.buttonBase} component={Link} to={route.path} >
                                                                {route.icon}
                                                                {route.text}
                                                            </Button>
                                                        </Grid>
                                                    );
                                                } else {
                                                    return (
                                                        <Grid item key={route.key}>
                                                            <Button color="default" className={classes.buttonBase} component={Link} to={route.path} >
                                                                {route.icon}
                                                                {route.text}
                                                            </Button>
                                                        </Grid>
                                                    );
                                                }

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
    authenticated: PropTypes.bool,
    location: PropTypes.object.isRequired,
    menus: PropTypes.object,
};

const mapState = state => ({
    menus: state.global.menus,
});

export default
    connect(mapState, null)(
        withTracker(() => {
            const loggingIn = Meteor.loggingIn();
            const userId = Meteor.userId();

            return {
                authenticated: !loggingIn && !!userId,
            };
        })(withRouter(withStyles(style)(Header)))
    );

