import React, { Component } from 'react';
import PropTypes from "prop-types";

import ListItem from '@material-ui/core/ListItem';

import IssueCompact from '../../../../../components/Issue/IssueCompact.js';

import {withStyles} from "@material-ui/core/styles";

const styles = {
    root: {
//        border: `1px solid ${theme.palette.divider}`,
//        margin: '5px',
//        minWidth: '220px',
    },
};

class IssueItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, issue } = this.props;
        return (
            <ListItem key={issue.id} className={classes.root}>
                <IssueCompact issue={issue} />
            </ListItem>
        );
    }
}

IssueItem.propTypes = {
    classes: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
};

export default withStyles(styles)(IssueItem);

/*

 */
