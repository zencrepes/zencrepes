import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';

import { connect } from "react-redux";

import QueryFacets from './QueryFacets.js';

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        top: 30,
        //position: 'relative',
        display: 'flex',
    },
    chip: {
        margin: theme.spacing.unit / 2,
    },
});

class Query extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render() {
        const { classes, queryValues } = this.props;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        {Object.keys(queryValues).map(idx => {
                            return (
                                <Paper className={classes.root} key={idx}>
                                    <QueryFacets queryContent={queryValues[idx]} />
                                </Paper>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        );
    }
}

Query.propTypes = {
    classes: PropTypes.object.isRequired,
    queryValues: PropTypes.object.isRequired,
};


const mapState = state => ({
    queryValues: state.data.filters,
});

export default connect(mapState, null)(withStyles(styles)(Query));
