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
import Button from 'material-ui/Button';

import { cfgIssues } from '../../data/Minimongo.js';

import _ from 'lodash';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
});

const ExpandButton = (props) => {
    if (props.collapsed && props.length > 5) {
        return ( <Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(false)}>more...</Button>);
    } else if (!props.collapsed && props.length > 5) {
        return (<Button color="primary" size="small" className={props.classes.button} onClick={props.onClick(true)}>less</Button>);
    } else {
        return null;
    }
}

class TextFacet extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dense: true,
            collapsed: true,
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

    collapseFacet = value => () => {
        console.log('CollapseFacet: ' + value)
        this.setState({collapsed: value})
    };

    render() {
        console.log('Facet render()');
        const { classes, facet, queryValues } = this.props;
        const { collapsed } = this.state;
        const {header, group, nested, data } = facet;

        let valueChecked = [];
        if (queryValues[group] !== undefined) {
            valueChecked = queryValues[group];
        }

        let facetsData = data;
        if (collapsed) {
            facetsData = data.slice(0, 5);
        }

        return (
            <div className={classes.root}>
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        {header}
                    </Typography>
                </Toolbar>
                <List dense={this.state.dense}>
                    {facetsData.map(value => (
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
                <ExpandButton collapsed={collapsed} length={data.length} classes={classes} onClick={this.collapseFacet}/>
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
