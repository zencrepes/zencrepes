import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import { connect } from "react-redux";


const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },

});

class QueryFacets extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    handleDelete = data => () => {
        const { removeFilter } = this.props;
        removeFilter(data);
    }

    render() {
        const { classes, queryContent, queryValues } = this.props;
        return (
            <div className={classes.root}>
                {queryContent.map(data => {
                        return (
                            <Chip
                                key={data.name}
                                label={data.name}
                                onDelete={this.handleDelete(data)}
                                className={classes.chip}
                            />
                        );
                })}
            </div>
        );
    }
}

QueryFacets.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    removeFilter: dispatch.filters.removeFilter,
});

const mapState = state => ({
    queryValues: state.filters.filters,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(QueryFacets));
