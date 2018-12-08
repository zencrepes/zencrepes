import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import Clear from './Clear.js';
import MongoFilter from './MongoFilter.js';
import Filters from './Filters/index.js';

import { addRemoveFromQuery } from "../../../utils/query/index.js";
import {withRouter} from "react-router-dom";

const styles = theme => ({
    root: {
        margin: '10px',
        border: `1px solid ${theme.palette.divider}`,
    },
    query: {
        flex: 1,
    },

});


class LabelsQuery extends Component {
    constructor (props) {
        super(props);
        this.state = {
            openSaveQueryDialog: false,
            openManageQueryDialog: false,
        }
    }

    clearQuery = () => {
        this.props.history.push({
            pathname: '/labels',
            search: '?q={}',
            state: { detail: '{}' }
        });
    };

    loadQuery = (query) => {
        console.log(query.filters);
        this.props.history.push({
            pathname: '/labels',
            search: '?q=' + query.filters,
            state: { detail: query.filters }
        });
        this.setState({ openManageQueryDialog: false });
    };

    saveQuery = (queryName) => {
        const { saveQuery } = this.props;
        saveQuery(queryName);
        this.setState({ openSaveQueryDialog: false });
    };

    deleteQuery = (query) => {
        const { deleteQuery } = this.props;
        deleteQuery(query);
    };

    updateQuery = (valueName, facet) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveFromQuery(valueName, facet, query);
        this.props.history.push({
            pathname: '/labels',
            search: '?q=' + JSON.stringify(modifiedQuery),
            state: { detail: modifiedQuery }
        });
    };

    setOpenSaveQueryDialog = (state) => {
        console.log('setOpenSaveQueryDialog');
        this.setState({ openSaveQueryDialog: state });
    };

    openSaveQueryDialog = () => {
        console.log('openSaveQueryDialog');
        this.setState({ openSaveQueryDialog: true });
    };

    closeSaveQueryDialog = () => {
        console.log('closeSaveQueryDialog');
        this.setState({ openSaveQueryDialog: false });
    };

    setOpenManageQueryDialog = (state) => {
        console.log('setOpenManageQueryDialog');
        this.setState({ openManageQueryDialog: state });
    };

    openManageQueryDialog = () => {
        console.log('openManageQueryDialog');
        this.setState({ openManageQueryDialog: true });
    };

    closeManageQueryDialog = () => {
        console.log('closeManageQueryDialog');
        this.setState({ openManageQueryDialog: false });
    };

    render() {
        const { classes, query, facets, queries } = this.props;
        console.log('Render - IssuesQuery: ' + JSON.stringify(query));
        console.log(facets);

        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item xs={12} sm container>
                        <Filters
                            query={query}
                            facets={facets}
                            updateQuery={this.updateQuery}
                        />
                    </Grid>
                    <Grid item >
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={0}
                        >
                            <Grid item >
                                <Clear onClick={this.clearQuery}/>
                            </Grid>
                            <Grid item >
                                <MongoFilter query={query}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

LabelsQuery.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    query: state.labelsView.query,
    facets: state.labelsView.facets,
});

export default withRouter(connect(mapState, null)(withStyles(styles)(LabelsQuery)));

