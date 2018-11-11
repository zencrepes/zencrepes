import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import TermFacet from './Term/index.js';

const styles = theme => ({
    root: {
        width: '250px',
        /*
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        */
    },
    progress: {
        margin: 10,
    },
});


class IssuesFacets extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, facets, query, addRemoveQuery, defaultPoints } = this.props;
        return (
            <div className={classes.root}>
                {facets.map(facet => {
                    return ( <TermFacet
                        facet={facet}
                        key={facet.name}
                        query={query}
                        defaultPoints={defaultPoints}
                        addRemoveQuery={addRemoveQuery}
                    />);
                })}
            </div>
        );
    }
}

IssuesFacets.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    facets: state.issuesView.facets,
    query: state.issuesView.query,
    defaultPoints: state.issuesView.defaultPoints,
});

const mapDispatch = dispatch => ({
    addRemoveQuery: dispatch.issuesView.addRemoveQuery,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(IssuesFacets));
