import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import TermFacet from './Term/index.js';

const styles = theme => ({
    root: {
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


class Facets extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        console.log('Facets - render()');
        const { classes, facets } = this.props;
        return (
            <div className={classes.root}>
                {facets.map(facet => {
                    return ( <TermFacet facet={facet} key={facet.name}/>);
                })}
            </div>
        );
    }
}

Facets.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    facets: state.issuesView.facets,
});

const mapDispatch = dispatch => ({
});

export default connect(mapState, mapDispatch)(withStyles(styles)(Facets));
