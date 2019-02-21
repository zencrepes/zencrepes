import React, { Component } from 'react';
import PropTypes from "prop-types";

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
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
            <Paper elevation={1} className={classes.root}>
                <List subheader={<ListSubheader>{column.title}</ListSubheader>} >
                    {children}
                </List>
            </Paper>
        );
    }
}

ColumnItem.propTypes = {
    classes: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
};

export default withStyles(styles)(ColumnItem);
