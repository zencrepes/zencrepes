import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
    root: {
    },
});
class Clear extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, onClick } = this.props;
        return (
            <IconButton className={classes.button} aria-label="Delete" onClick={onClick}>
                <ClearIcon />
            </IconButton>
        )
    };
}

Clear.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Clear);
