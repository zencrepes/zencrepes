import React, { Component } from 'react';
import PropTypes from "prop-types";

import List from '@material-ui/core/List';

import {withStyles} from "@material-ui/core/styles";

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
    },
    title: {
        padding: '5px',
        textAlign: 'center',
    },
    list: {
//        backgroundColor: '#ebebeb',
        height: '100%',
    },
    tableCell: {
    },
});

class ColumnItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes, column, children } = this.props;
        return (
            <div className={classes.root}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                    {column.title}
                </Typography>
                <List className={classes.list} key={column.id} >
                    {children}
                </List>
            </div>
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
