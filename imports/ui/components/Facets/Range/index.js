import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import FacetTitle from '../FacetTitle.js';
import FacetSelector from './FacetSelector.js';

const styles = theme => ({
    root: {

    }
});


class RangeFacet extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes, facet } = this.props;
        const {header, data } = facet;

        console.log(data);

        return (
            <div className={classes.root}>
                <FacetTitle title={header} />
                <FacetSelector data={data} />
            </div>
        );
    }
}

RangeFacet.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    addFilterRefresh: dispatch.data.addFilterRefresh,
    removeFilterRefresh: dispatch.data.removeFilterRefresh,
});

const mapState = state => ({
    queryValues: state.data.filters,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(RangeFacet));
