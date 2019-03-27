import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import IssueWide from '../Issue/IssueWide.js';

const styles = theme => ({
    repoName: {
        color: '#586069!important',
        fontSize: '16px',
        marginRight: '5px',
        textDecoration: "none",
    },
    issueTitle: {
        fontSize: '16px',
        color: '#000000!important',
        textDecoration: "none",
    },
    authorLink: {
        textDecoration: "none",
        fontSize: '12px',
        color: '#586069!important',
    },
    issueSubTitle: {
        textDecoration: "none",
        fontSize: '12px',
        color: '#586069!important',
    },
    avatar: {
        width: 35,
        height: 35,
    },
    chip: {
        marginRight: '5px',
        height: 25,
    },
    iconOpen: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: red[800],
    },
    iconClosed: {
        margin: theme.spacing.unit,
        fontSize: 20,
        color: green[800],
    },
    iconSprint: {
        fontSize: 16,
        margin: 0
    },
    label: {
        marginRight: 5,
        marginTop: 10,
        padding: 5,
        border: "1px solid #eeeeee",
    },
    chipAgile: {
        margin: '4px',
        height: '15px',
    },
});


class Issue extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { issue } = this.props;
        return (
            <TableRow key={issue.id}>
                <TableCell component="th" scope="row">
                    <IssueWide issue={issue} />
                </TableCell>
            </TableRow>
        );
    }
}

Issue.propTypes = {
    classes: PropTypes.object.isRequired,
    issue: PropTypes.object,
};

export default withStyles(styles)(Issue);
// <span><DirectionsRunIcon className={classes.iconSprint} />{issue.milestone.title}</span>
// <span><ViewColumnIcon className={classes.iconSprint} />{issue.boardState.name}</span>
