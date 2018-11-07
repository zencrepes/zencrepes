import _ from 'lodash';
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
    root: {
    },
});
class Delete extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { classes, onClick } = this.props;
        return (
            <IconButton className={classes.button} aria-label="Delete" onClick={onClick}>
                <DeleteIcon />
            </IconButton>
        )
    };
}

Delete.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Delete);
