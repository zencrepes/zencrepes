import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Aggregation from './Aggregation.js';

const styles = {
    root: {
        margin: '10px',
    },
    query: {
        flex: 1,
    },
};

class Filters extends Component {
    constructor (props) {
        super(props);
    }

    /**
     * getActiveFacets() parse query and returns facets contained in that query
     */
    getActiveFacets = (query, facets) => {
        return facets.filter((facet) => {
            if (query[facet.key] !== undefined || query[facet.key + '.edges'] !== undefined) {
                return true;
            } else {
                return false;
            }
        }).map((facet) => {
            if (facet.nested === false) {
                return {...facet, values: query[facet.key]['$in']};
            } else {
                return {...facet, values: query[facet.key + '.edges']['$elemMatch']['node.' + facet.nestedKey]['$in']};
            }
        });
    };

    render() {
        const { classes, query, facets, updateQuery } = this.props;
        const activeFacets = this.getActiveFacets(query, facets);
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
    query: PropTypes.object.isRequired,
    facets: PropTypes.array.isRequired,
    updateQuery: PropTypes.func.isRequired,
};

export default withStyles(styles)(Filters);
