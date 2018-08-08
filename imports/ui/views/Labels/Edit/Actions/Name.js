import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

class LabelName extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleToggle = value => () => {
        const { setUpdateName } = this.props;
        if (value === true) {setUpdateName(false);}
        else {setUpdateName(true);}
    };

    handleChange = name => event => {
        const { setNewName } = this.props;
        setNewName(event.target.value);
    };

    render() {
        const { classes, updateName, newName } = this.props;
        return (
            <ListItem >
                <TextField
                    id="full-width"
                    label="Name"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="Enter a name"
                    fullWidth
                    margin="normal"
                    value={newName}
                    onChange={this.handleChange('name')}
                />
                <ListItemSecondaryAction>
                    <Switch
                        onChange={this.handleToggle(updateName)}
                        checked={updateName}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

LabelName.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    updateName: state.labelsconfiguration.updateName,
    newName: state.labelsconfiguration.newName,
});

const mapDispatch = dispatch => ({
    setUpdateName: dispatch.labelsconfiguration.setUpdateName,
    setNewName: dispatch.labelsconfiguration.setNewName,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LabelName));