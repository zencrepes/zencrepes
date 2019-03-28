import React, { Component } from 'react';

import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';

class Save extends Component {
    constructor (props) {
        super(props);
    }

    render() {
      const { onClick } = this.props;
      return (
            <IconButton aria-label="Open" onClick={onClick}>
                <SaveIcon />
            </IconButton>
        )
    }
}

Save.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default Save;
