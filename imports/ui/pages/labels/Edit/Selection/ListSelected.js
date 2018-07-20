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

class ListSelected extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleToggle = value => () => {
        const { setToggledSelectedRepos, toggledSelectedRepos } = this.props;

        const currentIndex = toggledSelectedRepos.findIndex((repo) => {return repo.id === value.id});
        const newSelected = [...toggledSelectedRepos];

        if (currentIndex === -1) {
            newSelected.push(value);
        } else {
            newSelected.splice(currentIndex, 1);
        }
        setToggledSelectedRepos(newSelected);
    };
    

    render() {
        const { classes, filteredSelectedRepos, toggledSelectedRepos } = this.props;
        //filteredSelectedRepos.map(repo => {
        //    console.log(repo);
        //    console.log(repo.org.login + "/" + repo.name);
        //});
        return (
            <List className={classes.root}>
                {filteredSelectedRepos.map(repo => (
                    <ListItem
                        key={repo.id}
                        role={undefined}
                        dense
                        button
                        onClick={this.handleToggle(repo)}
                        className={classNames(classes.root, {
                            [classes.highlight]: toggledSelectedRepos.findIndex((r) => {return r.id === repo.id}) !== -1,
                        })}
                    >
                        <ListItemText primary={repo.org.login + "/" + repo.name} />
                    </ListItem>
                ))}
            </List>
        );
    }
}

ListSelected.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    filteredSelectedRepos: state.labelsconfiguration.filteredSelectedRepos,
    toggledSelectedRepos: state.labelsconfiguration.toggledSelectedRepos,
});

const mapDispatch = dispatch => ({
    setToggledSelectedRepos: dispatch.labelsconfiguration.setToggledSelectedRepos
});

export default connect(mapState, mapDispatch)(withStyles(styles)(ListSelected));