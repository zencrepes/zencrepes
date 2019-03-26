import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from "@material-ui/core/Typography/Typography";

class StateField extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { action, state, newState } = this.props;
        if (action === 'delete') {
            return (
                <Typography variant="body1" gutterBottom>
                    {state}
                </Typography>
            );
        } else if (action === 'create') {
            return (
                <Typography variant="body1" gutterBottom>
                    {newState}
                </Typography>
            );
        } else if (action === 'update' && state === newState) {
            return (
                <Typography variant="body1" gutterBottom>
                    {state}
                </Typography>
            );
        } else if ((action === 'update' && state !== newState) || action === 'close' ||  action === 'open') {
            return (
                <Typography variant="body1" gutterBottom>
                    <b>Old Value: </b> {state}
                    <br />
                    <b>New Value: </b> {newState}
                </Typography>
            )
        }
    }
}

StateField.propTypes = {
    action: PropTypes.string,
    state: PropTypes.string,
    newState: PropTypes.string,
};

export default StateField;
