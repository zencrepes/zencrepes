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

import SelectedColors from './SelectedColors.js';

const styles = theme => ({

});

class EditActions extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    addToSelected() {
        const { addToSelected } = this.props;
        addToSelected();
    }

    removeFromSelected() {
        const { addToAvailable } = this.props;
        addToAvailable();
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <h2>Actions</h2>
                <SelectedColors />
            </div>
        );
    }
}

EditActions.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({

});

const mapDispatch = dispatch => ({

});

export default connect(mapState, mapDispatch)(withStyles(styles)(EditActions));