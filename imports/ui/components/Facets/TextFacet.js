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
        const { addToQuery, removeFromQuery } = this.props;
        const { checked } = this.state;
        console.log(value);
        console.log(checked);
        //Return the index of the object containing name
        const currentIndex = checked.map((v) => {return v.name}).indexOf(value.name);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            addToQuery(value);
        } else {
            newChecked.splice(currentIndex, 1);
            removeFromQuery(value);
        }
        this.setState({
            checked: newChecked,
        });

    };

    render() {
        const { classes, data } = this.props;
        const {header, group, nested } = data;

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
                                checked={this.state.checked.map((v) => {return v.name}).indexOf(value.name) !== -1}
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
    addToQuery: dispatch.query.addToQuery,
    removeFromQuery: dispatch.query.removeFromQuery,
});

export default connect(null, mapDispatch)(withStyles(styles)(TextFacet));
