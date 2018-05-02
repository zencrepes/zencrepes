import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';

import { connect } from "react-redux";


const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
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
        console.log('Re-render query');
        console.log(queryValues);
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        <h1>Some TEST</h1>
                        <Chip
                            key='SOME KEY'
                            label='some label'
                            className={classes.chip}
                        />
                        <Paper className={classes.root}>
                            {queryValues['state'].map(data => {
                                return (
                                    <Chip
                                        key={data.name}
                                        label={data.name}
                                        className={classes.chip}
                                    />
                                );
                            })}
                        </Paper>
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
    queryValues: state.query.values,
});

export default connect(mapState, null)(withStyles(styles)(Query));
