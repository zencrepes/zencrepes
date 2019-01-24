import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from "@material-ui/core/Typography/Typography";

class DescriptionField extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { action, description, newDescription } = this.props;
        if (action === 'delete') {
            return (
                <Typography variant="body1" gutterBottom>
                    {description}
                </Typography>
            );
        } else if (action === 'create') {
            return (
                <Typography variant="body1" gutterBottom>
                    {newDescription}
                </Typography>
            );
        } else if (action === 'update' && description === newDescription) {
            return (
                <Typography variant="body1" gutterBottom>
                    {description}
                </Typography>
            );
        } else if (action === 'update' && description !== newDescription) {
            return (
                <Typography variant="body1" gutterBottom>
                    <b>Old Value: </b> {description}
                    <br />
                    <b>New Value: </b> {newDescription}
                </Typography>
            )
        }
    }
}

DescriptionField.propTypes = {
    action: PropTypes.string,
    description: PropTypes.string,
    newDescription: PropTypes.string,
};

export default DescriptionField;
