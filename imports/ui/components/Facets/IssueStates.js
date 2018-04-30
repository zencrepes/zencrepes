import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Chip from 'material-ui/Chip';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { cfgIssues } from '../../data/Issues.js';

import _ from 'lodash';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class IssueStates extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dense: true,
        };
    }

    getFacetData() {
        let statesGroup = _.groupBy(cfgIssues.find({}).fetch(), 'state');
        let states = [];
        Object.keys(statesGroup).forEach(function(key) {
            states.push({count: statesGroup[key].length, name: key});
        });
        return states;
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <Toolbar>
                    <Typography variant="title" color="inherit">
                    States
                    </Typography>
                </Toolbar>
                <List dense={this.state.dense}>
                    {this.getFacetData().map(value => (
                        <ListItem
                            key={value.name}
                            role={undefined}
                            dense
                            button
                            className={classes.listItem}
                        >
                            <Checkbox
                                checked={false}
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

IssueStates.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(IssueStates);
