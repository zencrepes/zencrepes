import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from "@material-ui/core/Typography/Typography";

class DueOnField extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { action, dueOn, newDueOn } = this.props;
        if (action === 'delete') {
            return (
                <Typography variant="body1" gutterBottom>
                    {dueOn}
                </Typography>
            );
        } else if (action === 'create') {
            return (
                <Typography variant="body1" gutterBottom>
                    {newDueOn}
                </Typography>
            );
        } else if (action === 'update' && dueOn === newDueOn) {
            return (
                <Typography variant="body1" gutterBottom>
                    {dueOn}
                </Typography>
            );
        } else if (action === 'update' && dueOn !== newDueOn) {
            return (
                <Typography variant="body1" gutterBottom>
                    <b>Old Value: </b> {dueOn}
                    <br />
                    <b>New Value: </b> {newDueOn}
                </Typography>
            )
        }
    }
}

DueOnField.propTypes = {
    action: PropTypes.string,
    dueOn: PropTypes.string,
    newDueOn: PropTypes.string,
};

export default DueOnField;
