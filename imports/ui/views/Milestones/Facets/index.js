import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import { withRouter, Link } from 'react-router-dom';

import { addRemoveFromQuery } from '../../../utils/query/index.js';
import TermFacet from './Term/index.js';

const styles = theme => ({
    root: {
        width: '250px',
        marginTop: '10px',
    },
});


class MilestonesFacets extends Component {
    constructor (props) {
        super(props);
    }

    addRemoveQuery = (valueName, facet) => {
        const { query } = this.props;
        const modifiedQuery = addRemoveFromQuery(valueName, facet, query);
        this.props.history.push({
            pathname: '/milestones',
            search: '?q=' + JSON.stringify(modifiedQuery),
            state: { detail: modifiedQuery }
        });
    };

    render() {
        const { classes, facets, query, addRemoveQuery } = this.props;
        console.log(facets);
        return (
            <div className={classes.root}>
                {facets.filter(facet => facet.hiddenFacet === undefined).map(facet => {
                    return ( <TermFacet
                        facet={facet}
                        key={facet.name}
                        query={query}
                        //addRemoveQuery={addRemoveQuery}
                        addRemoveQuery={this.addRemoveQuery}
                    />);
                })}
            </div>
        );
    }
}

MilestonesFacets.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    facets: state.milestonesView.facets,
    query: state.milestonesView.query,
});

export default withRouter(connect(mapState, null)(withStyles(styles)(MilestonesFacets)));
