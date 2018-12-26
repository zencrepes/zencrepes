import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

class LabelDescription extends Component {
    constructor(props) {
        super(props);
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
        const { updateDescription, newDescription } = this.props;
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
    updateDescription: PropTypes.string.isRequired,
    newDescription: PropTypes.string.isRequired,

    setUpdateDescription: PropTypes.func.isRequired,
    setNewDescription: PropTypes.func.isRequired,
};

const mapState = state => ({
    updateDescription: state.labelsEdit.updateDescription,
    newDescription: state.labelsEdit.newDescription,
});

const mapDispatch = dispatch => ({
    setUpdateDescription: dispatch.labelsEdit.setUpdateDescription,
    setNewDescription: dispatch.labelsEdit.setNewDescription,
});

export default connect(mapState, mapDispatch)(LabelDescription);