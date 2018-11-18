import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
    root: {
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
});


class Issue extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, issue } = this.props;
        return (
            <TableRow key={issue.id}>
                <TableCell component="th" scope="row">
                    {issue.org.login}/{issue.repo.name} {issue.title}
                </TableCell>
            </TableRow>
        );
    }
}

Issue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Issue);
