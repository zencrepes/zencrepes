import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { Settings, TableLarge, ChartLine } from 'mdi-material-ui';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router-dom';

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
    },
    drawerPaper: {
        position: 'relative',
        marginTop: '64px',
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
});

class LeftDrawer extends Component {

    render() {
        const { classes, theme } = this.props;

        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
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
                <Link to="/settings">
                    <ListItem button>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </Link>
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
