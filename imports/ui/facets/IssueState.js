import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});


function IssueState(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <List>
                <ListItem primaryText="All mail" />
                <ListItem primaryText="Trash" />
                <ListItem primaryText="Spam" />
                <ListItem primaryText="Follow up" />
            </List>
        </div>
    );
}

IssueState.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IssueState);

