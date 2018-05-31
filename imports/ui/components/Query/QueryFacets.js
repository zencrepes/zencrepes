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

    handleDelete = (data, group) => () => {
        const { removeFilterRefresh } = this.props;
        console.log(data);
        removeFilterRefresh({group: group, name: data});
    }

    render() {
        const { classes, queryContent, queryValues } = this.props;
        console.log(queryContent);

        if (queryContent.type === 'text' || queryContent.type === 'textCount') {
            return (
                <div className={classes.root}>
                    {queryContent.in.map(data => {
                        return (
                            <Chip
                                key={data}
                                label={data}
                                onDelete={this.handleDelete(data, queryContent.group)}
                                className={classes.chip}
                            />
                        );
                    })}
                </div>
            );
        } else if (queryContent.type === 'range') {
            return (
                <div className={classes.root}>
                    <Chip
                        key={queryContent.min}
                        label={'Min: ' + queryContent.min}
                        className={classes.chip}
                    />
                    <Chip
                        key={queryContent.max}
                        label={'Max: ' + queryContent.max}
                        className={classes.chip}
                    />
                </div>
            );
        } else {
            return null;
        }
    }
}

QueryFacets.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    removeFilterRefresh: dispatch.data.removeFilterRefresh,
});

const mapState = state => ({
    queryValues: state.data.filters,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(QueryFacets));
