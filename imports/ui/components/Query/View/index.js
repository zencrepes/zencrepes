import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';

import Button from '@material-ui/core/Button';

import { connect } from "react-redux";

import QueryFacets from './QueryFacets.js';
import QuerySaved from './QuerySaved.js';

import {buildMongoSelector} from '../../../utils/mongo/index.js';

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
    query: {
        display: 'inline'
    }
});

class QueryView extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    openQueryManager = () => {
        const { setOpenQueryManager } = this.props;
        setOpenQueryManager(true);
    };

    openSaveQuery = () => {
        const { setOpenSaveQuery } = this.props;
        setOpenSaveQuery(true);
    };

    render() {
        const { classes, filters } = this.props;
        console.log(filters);
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <CardContent>
                        <Paper className={classes.root}>
                        {Object.keys(filters).map(idx => {
                            return (
                                <div key={idx} className={classes.query}>{idx} {":"} <QueryFacets queryContent={filters[idx]} /></div>
                            );
                        })}
                        </Paper>

                        <br />Filter Object: <i>{JSON.stringify(filters)}</i>
                        <br />Mongo Filter: <i>{JSON.stringify(buildMongoSelector(filters))}</i>
                        <br />
                        <Button onClick={this.openSaveQuery} color="primary" autoFocus>
                            Save Query
                        </Button>
                        <Button onClick={this.openQueryManager} color="primary" autoFocus>
                            Open Query Manager
                        </Button>
                        <QuerySaved />
                    </CardContent>
                </Card>
            </div>
        );
    }
}

QueryView.propTypes = {
    classes: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
};


const mapState = state => ({
    filters: state.queries.filters,
});

const mapDispatch = dispatch => ({
    setOpenQueryManager: dispatch.queries.setOpenQueryManager,
    setOpenSaveQuery: dispatch.queries.setOpenSaveQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(QueryView));
