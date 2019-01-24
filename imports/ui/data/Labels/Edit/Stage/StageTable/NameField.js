import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from "@material-ui/core/Typography/Typography";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

class NameField extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { action, name, url, newName } = this.props;
        if (action === 'delete') {
            return (
                <Typography variant="body1" gutterBottom>
                    <a
                        href={url}
                        rel="noopener noreferrer" target="_blank">
                        {name}
                        <OpenInNewIcon style={{fontSize: 12}}/>
                    </a>
                </Typography>
            );
        } else if (action === 'create') {
            return (
                <Typography variant="body1" gutterBottom>
                    {newName}
                </Typography>
            );
        } else if (action === 'update' && name === newName) {
            return (
                <Typography variant="body1" gutterBottom>
                    <a
                        href={url}
                        rel="noopener noreferrer" target="_blank">
                        {name}
                        <OpenInNewIcon style={{fontSize: 12}}/>
                    </a>
                </Typography>
            );
        } else if (action === 'update' && name !== newName) {
            return (
                <Typography variant="body1" gutterBottom>
                    <b>Old Value: </b>
                    <a
                        href={url}
                        rel="noopener noreferrer" target="_blank">
                        {name}
                        <OpenInNewIcon style={{fontSize: 12}}/>
                    </a><br />
                    <b>New Value: </b>
                    {newName}
                </Typography>
            )
        }
    }
}

NameField.propTypes = {
    action: PropTypes.string,
    name: PropTypes.string,
    url: PropTypes.string,
    newName: PropTypes.string,
};

export default NameField;
