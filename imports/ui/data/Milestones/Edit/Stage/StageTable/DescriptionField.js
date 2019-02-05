import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from "@material-ui/core/Typography/Typography";

class DescriptionField extends Component {
    constructor (props) {
        super(props);
    }

    //From: https://stackoverflow.com/questions/5454235/shorten-string-without-cutting-words-in-javascript
    truncate = (description) => {
        if (description !== null && description !== undefined) {
            const maxLength = 15;
            let trimmedString = description.substr(0, maxLength);
            return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + '...';
        } else {
            return null;
        }
    };

    render() {
        const { action, description, newDescription } = this.props;
        const truncDescription = this.truncate(description);
        const truncNewDescription = this.truncate(newDescription);
        if (action === 'delete' || action === 'close' ||  action === 'open') {
            return (
                <Typography variant="body1" gutterBottom>
                    {truncDescription}
                </Typography>
            );
        } else if (action === 'create') {
            return (
                <Typography variant="body1" gutterBottom>
                    {truncNewDescription}
                </Typography>
            );
        } else if (action === 'update' && description === newDescription) {
            return (
                <Typography variant="body1" gutterBottom>
                    {truncDescription}
                </Typography>
            );
        } else if (action === 'update' && description !== newDescription) {
            return (
                <Typography variant="body1" gutterBottom>
                    <b>Old Value: </b> {truncDescription}
                    <br />
                    <b>New Value: </b> {truncNewDescription}
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
