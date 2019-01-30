import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from "@material-ui/core/Typography/Typography";
import SquareIcon from "mdi-react/SquareIcon";

class ColorField extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { action, color, newColor } = this.props;
        if (action === 'delete') {
            return (
                <Typography variant="body1" gutterBottom>
                    <SquareIcon color={'#' + color}/> ({'#' + color})
                </Typography>
            );
        } else if (action === 'create') {
            return (
                <Typography variant="body1" gutterBottom>
                    <SquareIcon color={'#' + newColor}/> ({'#' + newColor})
                </Typography>
            );
        } else if (action === 'update' && color === newColor) {
            return (
                <Typography variant="body1" gutterBottom>
                    <SquareIcon color={'#' + color}/> ({'#' + color})
                </Typography>
            );
        } else if (action === 'update' && color !== newColor) {
            return (
                <Typography variant="body1" gutterBottom>
                    <b>Old Value: </b>
                    <SquareIcon color={'#' + color}/> ({'#' + color})
                    <br />
                    <b>New Value: </b>
                    <SquareIcon color={'#' + newColor}/> ({'#' + newColor})
                </Typography>
            )
        }
    }
}

ColorField.propTypes = {
    action: PropTypes.string,
    color: PropTypes.string,
    newColor: PropTypes.string,
};

export default ColorField;
