import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';

import Clear from './Clear.js';

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


class Query extends Component {
    constructor (props) {
        super(props);
    }

    getActiveFacets = () => {
        const { query, facets } = this.props;
        let activeFacets = facets.filter((facet) => {
            let nestedFacetKey = facet.key + '.edges';
            if (query[facet.key] !== undefined || query[nestedFacetKey] !== undefined) {
                return true;
            }
        }).map((facet) => {
            console.log(facet);
            let values = [];
            if (facet.nested === false) {
                values = query[facet.key]['$in'];
            } else {
//                values = query[facet.key]['elemMatch'];
            }
            return {...facet, values: values}
        });
        return activeFacets;
    }

    render() {
        const { classes, query, facets } = this.props;
        console.log(this.getActiveFacets());
        console.log(query);
        console.log(facets);

/*        console.log(JSON.stringify(query));
        console.log(facets);
        console.log(JSON.stringify(facets.map((facet) => {
            return {
                key: facet.key,
                name: facet.name,
                nested: facet.nested,
                values: facet.values,
            }
        })));*/
        return (
            <div className={classes.root}>
                <span>Query: {JSON.stringify(query)}</span>
            </div>
        );
    }
}

Query.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Query);
