import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { NavLink } from "react-router-dom";

import sidebarStyle from "../../assets/jss/material-dashboard-react/components/sidebarStyle.jsx";

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Divider from '@material-ui/core/Divider';

import { Settings, TableLarge, ChartLine, ChartHistogram, ViewDashboard, Label, AutoFix } from 'mdi-material-ui';

import GitRequests from '../Github/GitRequests.js'

import PropTypes from "prop-types";

class Sidebar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, open, logoText } = this.props;
        const routes = [
            {path: '/dashboard', icon: (<ViewDashboard />), text: 'Dashboard', key: 'dash'},
            {path: '/search', icon: (<TableLarge />), text: 'Search', key: 'search'},
            {path: '/velocity', icon: (<ChartLine />), text: 'Velocity', key: 'velocity'},
            {path: '/burndown', icon: (<ChartHistogram />), text: 'Burndown', key: 'burndown'},
            {divider: true, key: 'configdivider'},
            {path: '/labels', icon: (<Label />), text: 'Labels', key: 'labels'},
            {path: '/settings', icon: (<Settings />), text: 'Settings', key: 'settings'},
            {path: '/wizard', icon: (<AutoFix />), text: 'Setup Wizard', key: 'wizard'},
        ];
        const links = (
            <List className={classes.list}>
                {routes.map((route) => {
                    if (route.divider !== undefined) {
                        return (<Divider key={route.key} className={classes.divider} />);
                    } else {
                        return (
                            <NavLink
                                to={route.path}
                                className={classes.item}
                                activeClassName="active"
                                key={route.key}
                            >
                                <ListItem button className={classes.itemLink}>
                                    <ListItemIcon className={classes.itemIcon}>
                                        {route.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={route.text}
                                        className={classes.itemText}
                                        disableTypography={true}
                                    />
                                </ListItem>
                            </NavLink>
                        );
                    }
                })}

            </List>
        );

        var brand = (
            <div className={classes.logo}>
                <a href="https://github.com/Fgerthoffert/github-agile-view" className={classes.logoLink}>
                    <div className={classes.logoImage}>
                        <img src="/react.png" />
                    </div>
                    {logoText}
                </a>
            </div>
        );

        return (
            <div>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor="right"
                        open={open}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        {brand}
                        <div className={classes.sidebarWrapper}>
                            <div className={classes.drawerMenu}>
                                <div className={classes.drawerMenuContent}>
                                    {links}
                                </div>
                                <div className={classes.drawerMenuFooter}>
                                    <GitRequests />
                                </div>
                            </div>
                        </div>
                        <div
                            className={classes.background}
                            style={{ backgroundImage: "url(/newyork.jpg)" }}
                        />
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        anchor="left"
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper
                        }}
                    >
                        {brand}
                        <div className={classes.sidebarWrapper}>
                            <div className={classes.drawerMenu}>
                                <div className={classes.drawerMenuContent}>
                                    {links}
                                </div>
                                <div className={classes.drawerMenuFooter}>
                                    <GitRequests />
                                </div>
                            </div>
                        </div>
                        <div
                            className={classes.background}
                            style={{ backgroundImage: "url(/newyork.jpg)" }}
                        />
                    </Drawer>
                </Hidden>
            </div>
        );
    }
}

Sidebar.propTypes = {
    classes: PropTypes.object,
};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withRouter(withStyles(sidebarStyle)(Sidebar)));
