import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

class LabelName extends Component {
    constructor(props) {
        super(props);
    }

    handleToggle = value => {
        const { setUpdateName } = this.props;
        if (value === true) {setUpdateName(false);}
        else {setUpdateName(true);}
    };

    handleChange = (event) => {
        const { setNewName } = this.props;
        setNewName(event.target.value);
    };

    render() {
        const { updateName, newName } = this.props;
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
                    onChange={this.handleChange}
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
    updateName: PropTypes.string.isRequired,
    newName: PropTypes.string.isRequired,

    setUpdateName: PropTypes.func.isRequired,
    setNewName: PropTypes.func.isRequired,
};

const mapState = state => ({
    updateName: state.labelsEdit.updateName,
    newName: state.labelsEdit.newName,
});

const mapDispatch = dispatch => ({
    setUpdateName: dispatch.labelsEdit.setUpdateName,
    setNewName: dispatch.labelsEdit.setNewName,
});

export default connect(mapState, mapDispatch)(LabelName);