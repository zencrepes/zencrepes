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

    render() {
        console.log('Facet render()');
        const { classes, facet, queryValues } = this.props;
        const {header, group, nested, data } = facet;

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
                    {data.map(value => (
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
    addFilterRefresh: dispatch.data.addFilterRefresh,
    removeFilterRefresh: dispatch.data.removeFilterRefresh,
});

const mapState = state => ({
    queryValues: state.data.filters,
});
export default connect(mapState, mapDispatch)(withStyles(styles)(TextFacet));
