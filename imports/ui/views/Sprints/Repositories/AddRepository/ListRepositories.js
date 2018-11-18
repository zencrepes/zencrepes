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

class ListRepositories extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    addRepository = repository => () => {
        console.log('addRepository');
        const { addRepository } = this.props;
        addRepository(repository);
    };

    render() {
        const { classes, filteredAvailableRepositories } = this.props;
        return (
            <List className={classes.root}>
                {filteredAvailableRepositories.map(repository => (
                    <ListItem
                        key={repository.id}
                        role={undefined}
                        dense
                        button
                        onClick={this.addRepository(repository)}
                    >
                        <ListItemText primary={repository.org.login + " / " + repository.name } />
                    </ListItem>
                ))}
            </List>
        );
    }
}

ListRepositories.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapState = state => ({
    filteredAvailableRepositories: state.sprintsView.filteredAvailableRepositories,
    toggledAvailableRepos: state.labelsEdit.toggledAvailableRepos,
});

const mapDispatch = dispatch => ({
    addRepository: dispatch.sprintsView.addRepository
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ListRepositories));