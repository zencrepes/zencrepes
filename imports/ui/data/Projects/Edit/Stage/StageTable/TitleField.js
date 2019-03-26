import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from "@material-ui/core/Typography/Typography";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

class TitleField extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { action, title, url, newTitle } = this.props;
        if (action === 'delete' || action === 'close' ||  action === 'open') {
            return (
                <Typography variant="body1" gutterBottom>
                    <a
                        href={url}
                        rel="noopener noreferrer" target="_blank">
                        {title}
                        <OpenInNewIcon style={{fontSize: 12}}/>
                    </a>
                </Typography>
            );
        } else if (action === 'create') {
            return (
                <Typography variant="body1" gutterBottom>
                    {newTitle}
                </Typography>
            );
        } else if (action === 'update' && title === newTitle) {
            return (
                <Typography variant="body1" gutterBottom>
                    <a
                        href={url}
                        rel="noopener noreferrer" target="_blank">
                        {title}
                        <OpenInNewIcon style={{fontSize: 12}}/>
                    </a>
                </Typography>
            );
        } else if (action === 'update' && title !== newTitle) {
            return (
                <Typography variant="body1" gutterBottom>
                    <b>Old Value: </b>
                    <a
                        href={url}
                        rel="noopener noreferrer" target="_blank">
                        {title}
                        <OpenInNewIcon style={{fontSize: 12}}/>
                    </a><br />
                    <b>New Value: </b>
                    {newTitle}
                </Typography>
            )
        }
    }
}

TitleField.propTypes = {
    action: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    newTitle: PropTypes.string,
};

export default TitleField;
