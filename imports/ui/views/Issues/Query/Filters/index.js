import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import Aggregation from './Aggregation.js';

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


class Filters extends Component {
    constructor (props) {
        super(props);
    }

    getActiveFacets = (query, facets) => {
        let activeFacets = facets.filter(facet => query[facet.key] !== undefined || query[facet.key + '.edges'] !== undefined).map((facet) => {
            let values = [];
            if (facet.nested === false) {
                values = query[facet.key]['$in'];
            } else {
                values = query[facet.key + '.edges']['$elemMatch']['node.' + facet.nestedKey]['$in'];
            }
            return {...facet, values: values}
        });
        return activeFacets;
    };

    render() {
        const { classes, query, queries, facets, updateQuery } = this.props;
        const foundQuery = queries.filter((currentQuery) => currentQuery.filters === JSON.stringify(query));

        const activeFacets = this.getActiveFacets(query, facets);
        console.log(activeFacets);
        return (
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={0}
                >

                    {activeFacets.map(facet => (
                        <Grid item key={facet.name}>
                            <Aggregation
                                query={query}
                                facets={activeFacets}
                                currentFacet={facet}
                                updateQuery={updateQuery}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

Filters.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filters);
