import React, { Component } from 'react';
import PropTypes from "prop-types";

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import TableCell from '@material-ui/core/TableCell';

import Paper from '@material-ui/core/Paper';
import {withStyles} from "@material-ui/core/styles";

const styles = {
    root: {
        margin: '5px',
        padding: '10px',
    },
};

class ColumnItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, column, children } = this.props;
        return (
            <TableCell component="th" scope="row" key={column.id}>
                <List>
                    {children}
                </List>
            </TableCell>
        );
    }
}

ColumnItem.propTypes = {
    classes: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};

export default withStyles(styles)(ColumnItem);
