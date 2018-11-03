import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Clear from './Clear.js';

const styles = theme => ({
    root: {
        height: '50px',
        position: 'relative',

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
        const { classes, query } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.query}>
                    <h4>Query: {JSON.stringify(query)}</h4>
                </div>
                <Clear clearQuery={this.clearQuery}/>
            </div>
        );
    }
}

IssuesQuery.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    query: state.issuesView.query,
});

const mapDispatch = dispatch => ({
    updateQuery: dispatch.issuesView.updateQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesQuery));
