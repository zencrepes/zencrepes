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

});

class LabelDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleToggle = value => () => {
        const { setUpdateDescription } = this.props;
        if (value === true) {setUpdateDescription(false);}
        else {setUpdateDescription(true);}
    };

    handleChange = name => event => {
        const { setNewDescription } = this.props;
        setNewDescription(event.target.value);
    };

    render() {
        const { classes, updateDescription, newDescription } = this.props;
        return (
            <ListItem >
                <TextField
                    id="full-width"
                    label="Description"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="Enter a description"
                    fullWidth
                    margin="normal"
                    value={newDescription}
                    onChange={this.handleChange('description')}
                />
                <ListItemSecondaryAction>
                    <Switch
                        onChange={this.handleToggle(updateDescription)}
                        checked={updateDescription}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

LabelDescription.propTypes = {
    classes: PropTypes.object.isRequired,

};

const mapState = state => ({
    updateDescription: state.labelsEdit.updateDescription,
    newDescription: state.labelsEdit.newDescription,
});

const mapDispatch = dispatch => ({
    setUpdateDescription: dispatch.labelsEdit.setUpdateDescription,
    setNewDescription: dispatch.labelsEdit.setNewDescription,
});

export default connect(mapState, mapDispatch)(withStyles(styles)(LabelDescription));