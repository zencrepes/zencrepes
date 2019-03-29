import React, { Component } from 'react';

import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class Delete extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { onClick } = this.props;
        return (
            <IconButton aria-label="Delete" onClick={onClick}>
                <DeleteIcon />
            </IconButton>
        )
    }
}

Delete.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default Delete;
