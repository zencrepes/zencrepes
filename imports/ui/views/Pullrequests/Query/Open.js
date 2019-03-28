import React, { Component } from 'react';

import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

class Open extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { onClick } = this.props;
        return (
            <IconButton aria-label="Open" onClick={onClick}>
                <FolderOpenIcon />
            </IconButton>
        )
    }
}

Open.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default Open;