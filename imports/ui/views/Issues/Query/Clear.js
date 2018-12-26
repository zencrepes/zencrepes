import React, { Component } from 'react';

import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

class Clear extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { onClick } = this.props;
        return (
            <IconButton aria-label="Delete" onClick={onClick}>
                <ClearIcon />
            </IconButton>
        )
    }
}

Clear.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default Clear;
