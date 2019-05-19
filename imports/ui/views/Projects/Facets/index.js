import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import { withRouter } from 'react-router-dom';

import { addRemoveFromQuery } from '../../../utils/query/index.js';
import TermFacet from './Term/index.js';

const styles = {
    root: {
        width: '250px',
        marginTop: '10px',
    },
};

class ProjectsFacets extends Component {
    constructor (props) {
        super(props);
    }

    addRemoveQuery = (valueName, facet) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveFromQuery(valueName, facet, query);
        this.props.history.push({
            pathname: '/projects',
            search: '?q=' + encodeURIComponent(JSON.stringify(modifiedQuery)),
            state: { detail: modifiedQuery }
        });
    };

    render() {
        const { classes, facets, query } = this.props;
        return (
            <div className={classes.root}>
                {facets.filter(facet => facet.hiddenFacet === undefined).map(facet => {
                    return ( <TermFacet
                        facet={facet}
                        key={facet.name}
                        query={query}
                        addRemoveQuery={this.addRemoveQuery}
                    />);
                })}
            </div>
        );
    }
}

ProjectsFacets.propTypes = {
    classes: PropTypes.object.isRequired,
    facets: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

const mapState = state => ({
    facets: state.projectsView.facets,
    query: state.projectsView.query,
});

export default withRouter(connect(mapState, null)(withStyles(styles)(ProjectsFacets)));
