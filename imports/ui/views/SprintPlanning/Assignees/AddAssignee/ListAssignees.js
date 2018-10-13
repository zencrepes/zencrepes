import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    highlight: {
        background: 'rgba(0, 0, 0, 0.07)',
    },
});

class ListAssignees extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    addAssignee = assignee => () => {
        console.log('addAssignee');
        const { addAssignee } = this.props;
        addAssignee(assignee);
    };

    render() {
        const { classes, filteredAvailableAssignees } = this.props;
        return (
            <List className={classes.root}>
                {filteredAvailableAssignees.map(assignee => (
                    <ListItem
                        key={assignee.id}
                        role={undefined}
                        dense
                        button
                        onClick={this.addAssignee(assignee)}
                    >
                        <ListItemText primary={assignee.name === null ? assignee.login : assignee.name} />
                    </ListItem>
                ))}
            </List>
        );
    }
}

ListAssignees.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    filteredAvailableAssignees: state.sprintsView.filteredAvailableAssignees,
    toggledAvailableRepos: state.labelsEdit.toggledAvailableRepos,
});

const mapDispatch = dispatch => ({
    addAssignee: dispatch.sprintsView.addAssignee
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ListAssignees));