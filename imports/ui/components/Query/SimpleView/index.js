import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import {buildMongoSelector} from "../../../utils/mongo";

const styles = theme => ({
    root: {
        //width: '100%',
        overflowX: 'auto',
    },
    textField: {
        width: '100%',
    },
    menu: {
        width: '100%',
    },
});

class SimpleView extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { classes, filters } = this.props;
        return (
            <div className={classes.root}>
                Current Query: {JSON.stringify(buildMongoSelector(filters))}
            </div>
        );
    }
}

SimpleView.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({

});

const mapState = state => ({
    filters: state.queries.filters,
});


export default connect(mapState, mapDispatch)(withStyles(styles)(SimpleView));
