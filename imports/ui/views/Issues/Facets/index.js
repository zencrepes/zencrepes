import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import { withRouter, Link } from 'react-router-dom';

import { addRemoveFromQuery } from '../../../utils/query/index.js';
import TermFacet from './Term/index.js';

const styles = theme => ({
    root: {
        width: '250px',
        paddingBottom: '10px',
        borderRight: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
    },
});


class IssuesFacets extends Component {
    constructor (props) {
        super(props);
    }

    addRemoveQuery = (valueName, facet) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveFromQuery(valueName, facet, query);
        this.props.history.push({
            pathname: '/issues',
            search: '?q=' + JSON.stringify(modifiedQuery),
            state: { detail: modifiedQuery }
        });
    };

    render() {
        const { classes, facets, query, addRemoveQuery, defaultPoints } = this.props;
        console.log(facets);
        return (
            <div className={classes.root}>
                {facets.filter(facet => facet.hiddenFacet === undefined).map(facet => {
                    return ( <TermFacet
                        facet={facet}
                        key={facet.name}
                        query={query}
                        defaultPoints={defaultPoints}
                        //addRemoveQuery={addRemoveQuery}
                        addRemoveQuery={this.addRemoveQuery}
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

export default withRouter(connect(mapState, mapDispatch)(withStyles(styles)(IssuesFacets)));
