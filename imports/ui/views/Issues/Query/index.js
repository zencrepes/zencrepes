import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import Clear from './Clear.js';
import Open from './Open.js';
import Save from './Save.js';
import MongoFilter from './MongoFilter.js';
import Filters from './Filters/index.js';

import QuerySave from './Save/index.js';
import QueryManage from './Manage/index.js';

import { addRemoveFromQuery, addRemoveDateFromQuery} from "../../../utils/query/index.js";
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

class IssuesQuery extends Component {
    constructor (props) {
        super(props);
        this.state = {
            openSaveQueryDialog: false,
            openManageQueryDialog: false,
        }
    }

    clearQuery = () => {
        this.props.history.push({
            pathname: '/issues',
            search: '?q={}',
            state: { detail: '{}' }
        });
    };

    loadQuery = (query) => {
        this.props.history.push({
            pathname: '/issues',
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
            pathname: '/issues',
            search: '?q=' + JSON.stringify(modifiedQuery),
            state: { detail: modifiedQuery }
        });
    };

    updateQueryDate = (field, direction, date) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveDateFromQuery(field, direction, date, query);
        this.props.history.push({
            pathname: '/issues',
            search: '?q=' + JSON.stringify(modifiedQuery),
            state: { detail: modifiedQuery }
        });
    };

    setOpenSaveQueryDialog = (state) => {
        this.setState({ openSaveQueryDialog: state });
    };

    openSaveQueryDialog = () => {
        this.setState({ openSaveQueryDialog: true });
    };

    closeSaveQueryDialog = () => {
        this.setState({ openSaveQueryDialog: false });
    };

    setOpenManageQueryDialog = (state) => {
        this.setState({ openManageQueryDialog: state });
    };

    openManageQueryDialog = () => {
        this.setState({ openManageQueryDialog: true });
    };

    closeManageQueryDialog = () => {
        this.setState({ openManageQueryDialog: false });
    };

    render() {
        const { classes, query, facets, queries, timeFields } = this.props;

        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    {queries.length > 0 &&
                        <Grid item >
                            <Open
                                onClick={this.openManageQueryDialog}
                            />
                            <QueryManage
                                queries={queries}
                                facets={facets}
                                timeFields={timeFields}
                                loadQuery={this.loadQuery}
                                deleteQuery={this.deleteQuery}
                                openManageQueryDialog={this.state.openManageQueryDialog}
                                setOpenManageQueryDialog={this.setOpenManageQueryDialog}
                            />
                        </Grid>
                    }
                    {queries.filter((currentQuery) => currentQuery.filters === JSON.stringify(query)).length === 0 &&
                      <Grid item >
                          <Save
                              onClick={this.openSaveQueryDialog}
                          />
                          <QuerySave
                              queries={queries}
                              saveQuery={this.saveQuery}
                              openSaveQueryDialog={this.state.openSaveQueryDialog}
                              setOpenSaveQueryDialog={this.setOpenSaveQueryDialog}
                          />
                      </Grid>
                    }
                    <Grid item xs={12} sm container>
                        <Filters
                            query={query}
                            facets={facets}
                            timeFields={timeFields}
                            updateQuery={this.updateQuery}
                            updateQueryDate={this.updateQueryDate}
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

IssuesQuery.propTypes = {
    classes: PropTypes.object.isRequired,

    query: PropTypes.object.isRequired,
    queries: PropTypes.array.isRequired,
    facets: PropTypes.array.isRequired,
    timeFields: PropTypes.array.isRequired,

    saveQuery: PropTypes.func.isRequired,
    deleteQuery: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired,
};

const mapState = state => ({
    query: state.issuesView.query,
    queries: state.issuesView.queries,
    facets: state.issuesView.facets,
    timeFields: state.issuesView.timeFields,
});

const mapDispatch = dispatch => ({
    saveQuery: dispatch.issuesView.saveQuery,
    deleteQuery: dispatch.issuesView.deleteQuery,
});

export default withRouter(connect(mapState, mapDispatch)(withStyles(styles)(IssuesQuery)));

