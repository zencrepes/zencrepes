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
import ArrowLeftBoxIcon from 'mdi-react/ArrowLeftBoxIcon';
import ArrowRightBoxIcon from 'mdi-react/ArrowRightBoxIcon';

import ItemGrid from '../../../../components/Grid/ItemGrid.js';
import { cfgLabels } from '../../../../data/Labels.js';
import { cfgSources } from '../../../../data/Orgs.js';

import ListAvailable from './ListAvailable.js';
import SearchAvailable from './SearchAvailable.js';
import ListSelected from './ListSelected.js';
import SearchSelected from './SearchSelected.js';

const styles = theme => ({

});

class EditSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    addToSelected() {
        const { addToSelected } = this.props;
        console.log('addToSelection');
        addToSelected();
    }

    removeFromSelected() {
        const { addToAvailable } = this.props;
        console.log('removeFromSelected');
        addToAvailable();
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container>
                <ItemGrid xs={5} sm={5} md={5}>
                    <h3>Available Repos</h3>
                    <SearchAvailable />
                    <ListAvailable />
                </ItemGrid>
                <ItemGrid xs={2} sm={2} md={2}>
                    <h3>Actions</h3>
                    <Button variant="outlined" color="primary" className={classes.button} onClick={() => this.addToSelected()}>
                        <ArrowRightBoxIcon />
                    </Button>
                    <Button variant="outlined" color="primary" className={classes.button} onClick={() => this.removeFromSelected()}>
                        <ArrowLeftBoxIcon />
                    </Button>
                </ItemGrid>
                <ItemGrid xs={5} sm={5} md={5}>
                    <h3>Selected Repos</h3>
                    <SearchSelected />
                    <ListSelected />
                </ItemGrid>
            </Grid>
        );
    }
}

EditSelection.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({
    addToAvailable: dispatch.labelsconfiguration.addToAvailable,
    addToSelected: dispatch.labelsconfiguration.addToSelected
});

export default connect(mapState, mapDispatch)(withStyles(styles)(EditSelection));