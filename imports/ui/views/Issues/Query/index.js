import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import Clear from './Clear.js';
import Query from './Query.js';

const styles = theme => ({
    root: {
        margin: '10px',
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
    }

    clearQuery = () => {
        const { updateQuery } = this.props;
        updateQuery({});
    };

    render() {
        const { classes, query, facets } = this.props;
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
                        <Query
                            query={query}
                            facets={facets}
                        />
                    </Grid>
                    <Grid item >
                        <Clear clearQuery={this.clearQuery}/>
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
    facets: state.issuesView.facets,
});

const mapDispatch = dispatch => ({
    updateQuery: dispatch.issuesView.updateQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesQuery));
