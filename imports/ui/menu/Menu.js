import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import ReloadButton from './ReloadButton';
import ComputeButton from './ComputeButton';
import {gh_issues} from "../../data_fetch/LoadIssues";
import {gh_repositories} from "../../data_fetch/LoadRepos";
import {gh_organizations, LoadOrgs} from "../../data_fetch/LoadOrgs";

import Drawer from '../drawer/Drawer';


const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

function ButtonAppBar(props) {
    const { classes } = props;

    const globalState = props.globalState;

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        Github Agile View
                    </Typography>
                    <ComputeButton color="inherit"></ComputeButton>
                    <ReloadButton color="inherit" globalState={globalState}></ReloadButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);