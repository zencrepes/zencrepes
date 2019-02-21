import React, { Component } from 'react';
import PropTypes from "prop-types";

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        border: `1px solid ${theme.palette.divider}`,
        margin: '5px',
    },
});

class IssueItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, issue } = this.props;
        return (
            <ListItem alignItems="flex-start" key={issue.id} className={classes.root}>
                <ListItemText
                    primary={issue.title}
                />
            </ListItem>
        );
    }
}

IssueItem.propTypes = {
    classes: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
};

export default withStyles(styles)(IssueItem);
