import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { Settings, TableLarge, ChartLine } from 'mdi-material-ui';
import Divider from 'material-ui/Divider';

import GitRequests from './GitRequests.js';

const drawerWidth = 200;

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 430,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});

class LeftDrawer extends Component {
    state = {
        open: true,
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes, theme } = this.props;

        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
                }}
                open={this.state.open}
            >
                <ListItem button>
                    <ListItemIcon>
                        <TableLarge />
                    </ListItemIcon>
                    <ListItemText primary="Search" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <ChartLine />
                    </ListItemIcon>
                    <ListItemText primary="Charts" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemIcon>
                        <Settings />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
                <GitRequests />
            </Drawer>
        );
    }
}

LeftDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(LeftDrawer);
