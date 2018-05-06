import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { connect } from "react-redux";

import { cfgIssues } from '../../data/Issues.js';

import _ from 'lodash';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class TextFacet extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dense: true,
            checked: [],
            queryValues: {},
        };
    }

    getFacetStatesData (group, nested) {
        let statesGroup = []
        if (nested) {
            let allValues = [];
            cfgIssues.find({}).forEach((issue) => {
                if (issue[group].totalCount === 0) {
                    allValues.push({name: 'EMPTY'});
                } else {
                    issue[group].edges.map((nestedValue) => {
                        if (nestedValue.node[nested] === null || nestedValue.node[nested] === '' || nestedValue.node[nested] === undefined ) {
                            //console.log({...nestedValue.node, name: nestedValue.node.login});
                            allValues.push({...nestedValue.node, name: nestedValue.node.login});
                        } else {
                            allValues.push(nestedValue.node);
                        }
                    })
                }
            })
            statesGroup = _.groupBy(allValues, nested);
        } else {
            statesGroup = _.groupBy(cfgIssues.find({}).fetch(), group);
        }
        let states = [];
        //console.log(statesGroup);
        Object.keys(statesGroup).forEach(function(key) {
            states.push({count: statesGroup[key].length, name: key, group: group, nested: nested});
        });
        //console.log(states);
        //Return the array sorted by count
        return states.sort((a, b) => b.count - a.count);
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

    //TODO - Might want to check if there has been a change in props instead of re-rendering all facets for any clicks
    /*
    shouldComponentUpdate(nextProps, nextState) {
        console.log('Preparing to update group: ' + nextProps.data.group);
        let previousQueryValues = {};
        let newQueryValues = {};

        // Compare query values with previous ones for this particular facet type to identify possible changes
        if (this.props.queryValues[this.props.data.group] !== undefined) {
            previousQueryValues = this.props.queryValues[this.props.data.group];
        }
        if (nextProps.queryValues[this.props.data.group] !== undefined) {
            newQueryValues = nextProps.queryValues[this.props.data.group];
        }
        if (_.isMatch(previousQueryValues, newQueryValues)) {
            console.log('No changes in queries, not re-rendering');
            return false;
        } else {
            return true;
        }
    }
    */

    render() {
        const { classes, data, queryValues } = this.props;
        const {header, group, nested } = data;

        let valueChecked = [];
        if (queryValues[group] !== undefined) {
            valueChecked = queryValues[group];
        }

        return (
            <div className={classes.root}>
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        {header}
                    </Typography>
                </Toolbar>
                <List dense={this.state.dense}>
                    {this.getFacetStatesData(group, nested).map(value => (
                        <ListItem
                            key={value.name}
                            role={undefined}
                            dense
                            button
                            onClick={this.handleToggle(value)}
                            className={classes.listItem}
                        >
                            <Checkbox
                                checked={valueChecked.map((v) => {return v.name}).indexOf(value.name) !== -1}
                                tabIndex={-1}
                                disableRipple
                            />
                            <ListItemText primary={value.name} />
                            <ListItemSecondaryAction>
                                <Chip label={value.count} className={classes.chip} />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}

TextFacet.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapDispatch = dispatch => ({
    addFilterRefresh: dispatch.filters.addFilterRefresh,
    removeFilterRefresh: dispatch.filters.removeFilterRefresh,
});

const mapState = state => ({
    queryValues: state.filters.filters,
});
export default connect(mapState, mapDispatch)(withStyles(styles)(TextFacet));
