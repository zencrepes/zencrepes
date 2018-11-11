import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {BrowserRouter as Router, Link, Route, withRouter} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import { Settings, Calendar, ChartLine, ChartHistogram, ViewDashboard, Label, AutoFix, RunFast } from 'mdi-material-ui';

import styles from "../styles.jsx";

import UserMenu from '../UserMenu.js';

class HeaderToolbar extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const { selectedButton } = this.props;

        const routes = [
            {path: '/issues', icon: (<ViewDashboard className={classes.leftIcon} />), text: 'Issues', key: 'issues'},
            {path: '/sprint', icon: (<RunFast className={classes.leftIcon} />), text: 'Sprints', key: 'sprint'},
            {path: '/labels', icon: (<Label className={classes.leftIcon} />), text: 'Labels', key: 'labels'},
            {path: '/milestones', icon: (<Calendar className={classes.leftIcon} />), text: 'Milestones', key: 'milestones'},
            {path: '/settings', icon: (<Settings className={classes.leftIcon} />), text: 'Settings', key: 'settings'},
        ];
        return (
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
        );
    }
}

HeaderToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(HeaderToolbar));
