import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';


import MagnifyIcon from 'mdi-react/MagnifyIcon';

import ItemGrid from '../../../../components/Grid/ItemGrid.js';
import { cfgLabels } from '../../../../data/Labels.js';
import { cfgSources } from '../../../../data/Orgs.js';

const styles = theme => ({
    listroot: {
        width: '100%',
        maxWidth: 360,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
});

class ListAvailable extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleToggle = value => () => {
        const { setToggledAvailableRepos, toggledAvailableRepos } = this.props;

        const currentIndex = toggledAvailableRepos.findIndex((repo) => {return repo.id === value.id});
        const newAvailable = [...toggledAvailableRepos];

        if (currentIndex === -1) {
            newAvailable.push(value);
        } else {
            newAvailable.splice(currentIndex, 1);
        }
        setToggledAvailableRepos(newAvailable);
    };
    

    render() {
        const { classes, filteredAvailableRepos, toggledAvailableRepos } = this.props;
        return (
            <List className={classes.listroot}>
                {filteredAvailableRepos.map(repo => (
                    <ListItem
                        key={repo.id}
                        role={undefined}
                        dense
                        button
                        onClick={this.handleToggle(repo)}
                        className={classes.listItem}
                    >
                        <ListItemText primary={repo.name} />
                    </ListItem>
                ))}
            </List>
        );
    }
}

ListAvailable.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    filteredAvailableRepos: state.labelsconfiguration.filteredAvailableRepos,
    toggledAvailableRepos: state.labelsconfiguration.toggledAvailableRepos,
});

const mapDispatch = dispatch => ({
    setToggledAvailableRepos: dispatch.labelsconfiguration.setToggledAvailableRepos
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ListAvailable));