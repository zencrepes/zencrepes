import React, { Component } from 'react';
import _ from 'lodash';

import {
    withRouter
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import IconButton from '@material-ui/core/IconButton';

import { GithubCircle } from 'mdi-material-ui'

import tableStyle from './tableStyle.jsx';



const DateFormatter = (value) => {
    if (value !== null) {return value.slice(0, 10);}
    else {return '-';}
};

const openGitHub = (githubLink) => {
    window.open(githubLink, '_blank');
};


class IssuesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }


    render() {
        const { classes, tableHeaderColor, tableData } = this.props;

        console.log(tableData);

        if (tableData.length > 0) {
            return (
                <div className={classes.tableResponsive}>
                    <Table className={classes.table}>
                        <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
                            <TableRow key={0}>
                                <TableCell className={classes.tableCell} key={1}>Title</TableCell>
                                <TableCell className={classes.tableCell} key={2}>Created</TableCell>
                                <TableCell className={classes.tableCell} key={3}>Updated</TableCell>
                                <TableCell className={classes.tableCell} key={4}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((issue, key) => {
                                return (
                                    <TableRow key={issue.id}>
                                        <TableCell className={classes.tableCell} key={1}>
                                            {issue.title}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={2}>
                                            {DateFormatter(issue.createdAt)}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={3}>
                                            {DateFormatter(issue.updatedAt)}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} key={4}>
                                            <IconButton variant="fab" color="primary" size="small" aria-label="open in GitHub" onClick={() => { openGitHub(issue.url); }} >
                                                <GithubCircle />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            );
        } else {
            return null;
        }

    }
}

IssuesTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});


const mapState = state => ({

});


export default
    connect(mapState, mapDispatch)
    (
            withRouter
            (
                withStyles(tableStyle)(IssuesTable)
            )
    );

