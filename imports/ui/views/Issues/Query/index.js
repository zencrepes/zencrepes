import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import Clear from './Clear.js';
import Open from './Open.js';
import Save from './Save.js';
import MongoFilter from './MongoFilter.js';
import Filters from './Filters/index.js';

import QuerySave from './Save/index.js';
import QueryManage from './Manage/index.js';

const styles = theme => ({
    root: {
        margin: '10px',
        border: `1px solid ${theme.palette.divider}`,
//        display: 'flex',
//        flexDirection: 'column',
//        height: '50px',
//        position: 'relative',

        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
    query: {
        flex: 1,
    },

});


class IssuesQuery extends Component {
    constructor (props) {
        super(props);
        this.state={
            openSaveQueryDialog: false,
            openManageQueryDialog: false,
        }
    }

    clearQuery = () => {
        const { updateQuery } = this.props;
        updateQuery({});
    };

    openQuery = () => {
        console.log('openQuery');
    };

    setOpenSaveQueryDialog = (state) => {
        console.log('setOpenSaveQueryDialog');
        this.setState({ openSaveQueryDialog: state });
    }

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
    }

    openManageQueryDialog = () => {
        console.log('openManageQueryDialog');
        this.setState({ openManageQueryDialog: true });
    };

    closeManageQueryDialog = () => {
        console.log('closeManageQueryDialog');
        this.setState({ openManageQueryDialog: false });
    };



    render() {
        const { classes, query, facets, saveQuery, queries } = this.props;
        console.log(query);

        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                >
                    <Grid item >
                        <Open
                            onClick={this.openManageQueryDialog}
                        />
                        <QueryManage
                            queries={queries}
                            loadQuery={saveQuery}
                            deleteQuery={saveQuery}
                            openManageQueryDialog={this.state.openManageQueryDialog}
                            setOpenManageQueryDialog={this.setOpenManageQueryDialog}
                        />
                        <Save
                            queries={queries}
                            query={query}
                            onClick={this.openSaveQueryDialog}
                        />
                        <QuerySave
                            query={query}
                            queries={queries}
                            saveQuery={saveQuery}
                            openSaveQueryDialog={this.state.openSaveQueryDialog}
                            setOpenSaveQueryDialog={this.setOpenSaveQueryDialog}
                        />
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Filters
                            query={query}
                            queries={queries}
                            facets={facets}
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
};

const mapState = state => ({
    query: state.issuesView.query,
    queries: state.issuesView.queries,
    facets: state.issuesView.facets,
});

const mapDispatch = dispatch => ({
    updateQuery: dispatch.issuesView.updateQuery,
    saveQuery: dispatch.issuesView.saveQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesQuery));
