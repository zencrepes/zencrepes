import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import { withRouter } from 'react-router-dom';

import {
    addRemoveFromQuery,
    addRemoveDateFromQuery,
} from '../../../utils/query/index.js';
import TermFacet from './Term/index.js';
import TimeFacet from './Time/index.js';

const styles = {
    root: {
        width: '250px',
        marginTop: '10px',
    },
};

class IssuesFacets extends Component {
    constructor (props) {
        super(props);
    }

    addRemoveQuery = (valueName, facet) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveFromQuery(valueName, facet, query);
        this.props.history.push({
            pathname: '/repositories',
            search: '?q=' + encodeURIComponent(JSON.stringify(modifiedQuery)),
            state: { detail: modifiedQuery }
        });
    };

    addRemoveDateQuery = (field, direction, date) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveDateFromQuery(field, direction, date, query);
        this.props.history.push({
            pathname: '/repositories',
            search: '?q=' + encodeURIComponent(JSON.stringify(modifiedQuery)),
            state: { detail: modifiedQuery }
        });
    };

    render() {
        const { classes, facets, query, defaultPoints } = this.props;
        return (
            <div className={classes.root}>
                <TimeFacet
                    addRemoveDateQuery={this.addRemoveDateQuery}
                    query={query}
                />
                {facets.filter(facet => facet.hiddenFacet === undefined).map(facet => {
                    return ( <TermFacet
                        facet={facet}
                        key={facet.name}
                        query={query}
                        defaultPoints={defaultPoints}
                        addRemoveQuery={this.addRemoveQuery}
                    />);
                })}
            </div>
        );
    }
}

IssuesFacets.propTypes = {
    classes: PropTypes.object.isRequired,

    facets: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    defaultPoints: PropTypes.bool.isRequired,

    history: PropTypes.object.isRequired,
};

const mapState = state => ({
    facets: state.repositoriesView.facets,
    query: state.repositoriesView.query,
    defaultPoints: state.repositoriesView.defaultPoints,
});

export default withRouter(connect(mapState, null)(withStyles(styles)(IssuesFacets)));
