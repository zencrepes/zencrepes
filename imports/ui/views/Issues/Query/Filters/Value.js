import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    root: {
        marginLeft: '5px',
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


class Value extends Component {
    constructor (props) {
        super(props);
    }

    handleDelete = () => {
        const { query, facets, currentFacet, value } = this.props;
        console.log('delete');
        console.log(query);
        console.log(facets);
        console.log(currentFacet);
        console.log(value);        
    }

    render() {
        const { classes, query, facets, currentFacet, value } = this.props;
        return (
            <Chip onDelete={this.handleDelete} variant="outlined" label={value} className={classes.root} />
        );
    }
}

Value.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Value);
