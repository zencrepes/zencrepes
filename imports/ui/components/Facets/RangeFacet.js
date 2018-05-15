import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import InputRange from 'react-input-range';

import { connect } from "react-redux";
import Button from 'material-ui/Button';

import { cfgIssues } from '../../data/Issues.js';

import _ from 'lodash';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
});


class RangeFacet extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dense: true,
            checked: [],
            queryValues: {},
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate');
        if (nextProps.data !== undefined && nextProps.data.length > 0 ) {return true;}
        else {return false;}
    }

    handleToggle = value => () => {
        const { addFilterRefresh, removeFilterRefresh, queryValues } = this.props;

        //check to handle the situation where the group does not exist yet
        let valueChecked = [];
        if (queryValues[value.group] !== undefined) {
            valueChecked = queryValues[value.group];
        }
        //Check if the value is already in the model, if yes remove, if not add.
        const currentIndex = valueChecked.map((v) => {return v.name}).indexOf(value.name);
        if (currentIndex === -1) {
            addFilterRefresh(value);
        } else {
            removeFilterRefresh(value);
        }
    };

    getMax = (data) => {
        return Math.max.apply(Math, data.map(function(o) { return o.name; }));
    };
    getMin = (data) => {
        return Math.min.apply(Math, data.map(function(o) { return o.name; }));
    };

    render() {
        console.log('Facet render()');
        const { classes, facet, queryValues } = this.props;
        const { collapsed } = this.state;
        const {header, group, nested, data } = facet;
        console.log(data);
        console.log('Min: ' + this.getMin(data));
        console.log('Max: ' + this.getMax(data));
        return (
            <div className={classes.root}>
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        {header}
                    </Typography>
                </Toolbar>
                <InputRange
                    draggableTrack
                    minValue={this.getMin(data)}
                    maxValue={this.getMax(data)}
                />
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
